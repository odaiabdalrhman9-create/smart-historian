"use client";

import { useMemo, useState } from "react";
import {
  BookOpen, Brain, ChevronLeft, CircleHelp, GitBranch, Lightbulb,
  Map, MessageCircle, Send, ShieldCheck, Sparkles, Target, Trophy,
  ArrowRight, CheckCircle2, RotateCcw
} from "lucide-react";
import { UNIT6_LESSONS } from "../data/unit6";
import { CausalMap } from "../components/CausalMap";
import type { Lesson, ReasoningLabel } from "../types/historian";

type View = "home" | "lesson" | "map" | "why" | "whatif" | "challenge" | "teacher" | "chat";
type ChatMessage = { role: "assistant" | "user"; text: string };

const STEPS = ["اكتشف", "اربط", "فسّر", "اختبر", "دافع عن تفسيرك"];

function evaluateAnswer(text: string, lesson: Lesson) {
  const answer = text.trim();
  const lower = answer.toLowerCase();
  if (!answer) {
    return {
      label: "لم تُقدَّم إجابة",
      score: 0,
      strengths: ["لم تُرسل إجابة لتقييمها بعد."],
      improvements: ["اكتب تفسيرًا يربط عاملًا واحدًا على الأقل بالحدث."],
      criteria: { relevance: 0, causalLink: 0, multipleFactors: 0, evidence: 0 }
    };
  }

  const causeMatches = lesson.causes.filter(c =>
    answer.includes(c.title) || c.title.split(/\s+/).filter(w => w.length > 4).some(w => answer.includes(w))
  );
  const causalWords = /(لأن|بسبب|أدى إلى|أدى|ساهم|نتج عن|نتيجة|لذلك|ومن ثم|أثر|أثّر|يسهم|يؤدي)/.test(answer);
  const evidenceWords = /(الدليل|النص|المصدر|ورد في|يشير الدرس|بحسب|وفقًا|وفق|الوثيقة)/.test(answer);
  const consequenceWords = /(نتيجة|نتائج|أثر|آثار|أدى إلى|ترتب|انتهى إلى)/.test(answer);
  const multipleFactors = causeMatches.length >= 2 || /(من جهة|إضافة إلى|كذلك|أيضًا|عامل آخر|عدة عوامل|أسباب متعددة)/.test(answer);
  const relevance = causeMatches.length ? 100 : 35;
  const causalLink = causalWords ? 100 : 30;
  const factors = multipleFactors ? 100 : 45;
  const evidence = evidenceWords ? 100 : 25;
  const score = Math.round(relevance * .3 + causalLink * .35 + factors * .2 + evidence * .15);
  let label: string;
  if (!causalWords && causeMatches.length) label = "إجابة صحيحة جزئيًا دون تفسير للعلاقة";
  else if (!evidenceWords) label = "تفسير يحتاج إلى دليل";
  else if (causeMatches.length >= 2 && causalWords && evidenceWords) label = "تفسير مترابط يستند إلى إشارة للدليل";
  else if (causalWords) label = "تفسير جزئي";
  else label = "تفسير يحتاج إلى مراجعة";
  const strengths: string[] = [];
  const improvements: string[] = [];
  if (causeMatches.length) strengths.push(`ذكرت عاملًا/عوامل مرتبطة ببيانات الدرس: ${causeMatches.map(c => c.title).join("، ")}.`);
  else improvements.push("حاول تسمية عامل محدد من الدرس بدل الاكتفاء بعبارة عامة.");
  if (causalWords) strengths.push("توجد إشارة لغوية إلى علاقة سببية.");
  else improvements.push("اشرح كيف أثّر العامل في الحدث باستخدام صياغة مثل: «ساهم في ذلك لأن…».");
  if (multipleFactors) strengths.push("تظهر محاولة للنظر إلى أكثر من عامل أو ربط الأفكار.");
  else improvements.push("اختبر ما إذا كان هناك عامل آخر يكمّل تفسيرك، ولا تفترض أن حدثًا تاريخيًا كبيرًا له سبب واحد فقط.");
  if (evidenceWords) strengths.push("أشرت إلى دليل أو مصدر؛ تأكد أن الدليل يدعم الادعاء فعلًا.");
  else improvements.push("أضف دليلًا محددًا من نص الدرس أو وثيقة تاريخية؛ ذكر كلمة «الدليل» وحدها لا يكفي.");
  if (consequenceWords && !/(سبب.*نتيجة|النتيجة.*سبب)/.test(answer)) {
    strengths.push("أشرت إلى نتيجة أو أثر.");
  }
  return { label, score, strengths, improvements, criteria: { relevance, causalLink, multipleFactors: factors, evidence } };
}

function answerHistorian(question: string, lesson: Lesson): string {
  const q = question.trim();
  if (!q) return "اكتب سؤالك أولًا، وسأساعدك على التفكير في الحدث.";
  const normalized = q.toLowerCase();
  const causes = lesson.causes;
  const consequences = lesson.consequences;
  if (/(سبب|أسباب|لماذا|عوامل|ساهم|أدى إلى حدوث)/.test(normalized)) {
    const list = causes.slice(0, 4).map((c, i) => `${i + 1}. ${c.title}: ${c.description}`).join("\n");
    return `لنبدأ من سؤال «لماذا» حول ${lesson.event}.\n\nمن العوامل المسجلة في بيانات هذا الدرس التجريبي:\n${list}\n\nسؤال للتفكير: أي عامل تراه أكثر تأثيرًا؟ وكيف تشرح الصلة بينه وبين الحدث؟ استند إلى دليل من نص الدرس قبل اعتماد تفسيرك.`;
  }
  if (/(نتيجة|نتائج|آثار|أثر|ماذا حدث بعد)/.test(normalized)) {
    const list = consequences.slice(0, 4).map((c, i) => `${i + 1}. ${c.title}: ${c.description}`).join("\n");
    return `يمكنك فحص النتائج والآثار المرتبطة بـ${lesson.event} في بيانات الدرس:\n${list}\n\nميّز بين النتيجة المباشرة والأثر طويل المدى، ولا تعتبر العلاقة مؤكدة ما لم يدعمها مصدر الدرس.`;
  }
  const foundCause = causes.find(c => q.includes(c.title));
  if (foundCause) {
    return `${foundCause.title}\n\nالتفسير المسجل: ${foundCause.description}\n\nإشارة الدليل في بيانات النموذج: ${foundCause.evidence?.[0] ?? "لم يُضف دليل محدد بعد."}\n\nفكّر الآن: كيف يوضح هذا الدليل أثر العامل في الحدث؟ ملاحظة: محتوى النموذج تجريبي ويحتاج إلى مطابقته مع الكتاب المدرسي قبل استخدامه مرجعًا نهائيًا.`;
  }
  const foundConsequence = consequences.find(c => q.includes(c.title));
  if (foundConsequence) {
    return `${foundConsequence.title}\n\nالوصف: ${foundConsequence.description}\n\nسؤال للتفكير: هل هذه نتيجة مباشرة أم أثر بعيد المدى؟ ما الدليل الذي يدعم تصنيفك؟`;
  }
  if (/(مصدر|دليل|وثيقة|الكتاب|الدرس)/.test(normalized)) {
    return `مصادر الأدلة في النسخة الحالية غير مكتملة التوثيق. توجد إشارات تجريبية داخل بيانات درس «${lesson.title}»، لكنها ليست بديلًا عن مراجعة الكتاب المدرسي أو وثيقة موثوقة. افتح الدرس وحدد الادعاء الذي تريد التحقق منه، ثم طابقه مع النص الأصلي.`;
  }
  return `أستطيع مساعدتك في تحليل «${lesson.event}» من خلال الأسباب والنتائج المسجلة في بيانات الدرس الحالية، لكنني لا أملك في هذه النسخة اتصالًا مباشرًا بنموذج ذكاء اصطناعي خارجي أو بحثًا موثقًا على الإنترنت.\n\nجرّب أن تسأل: «ما أبرز الأسباب؟» أو «ما النتائج؟» أو اكتب اسم أحد العوامل الظاهرة في الدرس. ثم اسأل نفسك: ما الدليل؟ وكيف ترتبط المعلومة بالحدث؟`;
}

export default function Home() {
  const [lesson, setLesson] = useState<Lesson>(UNIT6_LESSONS[0]);
  const [view, setView] = useState<View>("home");
  const [step, setStep] = useState(0);
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [whatIf, setWhatIf] = useState<string | null>(null);
  const [challengeText, setChallengeText] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "مرحبًا بك في «اسأل المؤرخ الذكي». سأساعدك على تحليل الأسباب والنتائج، مع التنبيه إلى أن محتوى هذه النسخة تجريبي وغير موصول حاليًا بنموذج ذكاء اصطناعي خارجي. اسألني عن أسباب الحدث أو نتائجه." }
  ]);
  const [lastEvaluation, setLastEvaluation] = useState<ReturnType<typeof evaluateAnswer> | null>(null);

  const selectedCauseObjects = useMemo(
    () => lesson.causes.filter(c => selectedCauses.includes(c.id)),
    [lesson, selectedCauses]
  );

  function startLesson(nextLesson: Lesson = lesson) {
    setLesson(nextLesson);
    setView("lesson");
    setStep(0);
    setSelectedCauses([]);
    setAnswer("");
    setLastEvaluation(null);
    setSelectedNode(null);
    setWhatIf(null);
    setChallengeText("");
  }

  function toggleCause(id: string) {
    setSelectedCauses(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  }

  function sendChat() {
    const question = chatInput.trim();
    if (!question) return;
    const response = answerHistorian(question, lesson);
    setChatMessages(current => [...current, { role: "user", text: question }, { role: "assistant", text: response }]);
    setChatInput("");
  }

  const evaluation = lastEvaluation;

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => setView("home")} aria-label="العودة إلى الرئيسية">
          <span className="brand-mark"><Brain size={23}/></span>
          <span><b>المؤرخ الذكي</b><small>من حفظ الأحداث إلى تفسيرها</small></span>
        </button>
        <nav>
          <button onClick={() => setView("home")}>الرئيسية</button>
          <button onClick={() => setView("chat")}><MessageCircle size={16}/> اسأل المؤرخ</button>
          <button onClick={() => setView("teacher")}>لوحة المعلم</button>
        </nav>
      </header>

      {view === "home" && <>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={15}/> مختبر التفكير التاريخي</div>
            <h1>المؤرخ <span>الذكي</span></h1>
            <h2>من حفظ الأحداث إلى تفسيرها</h2>
            <p>لا تكتفِ بمعرفة ما حدث. اكتشف لماذا حدث، واربط الأسباب بالقرارات والنتائج، ثم ابنِ تفسيرك التاريخي المدعوم بالدليل.</p>
            <div className="hero-actions">
              <button className="primary" onClick={() => startLesson()}><BookOpen size={18}/> ابدأ رحلة المؤرخ <ArrowRight size={17}/></button>
              <button className="secondary" onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}><CircleHelp size={18}/> كيف يعمل؟</button>
            </div>
            <div className="developer-credit">تصميم وتطوير: <strong>عدي عبد الرحمن</strong></div>
          </div>
          <div className="hero-visual" aria-label="سلسلة التفكير التاريخي">
            <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
            <div className="history-core"><Map size={50}/><b>فكّر كمؤرخ</b><small>اكتشف العلاقات</small></div>
            <div className="floating-chip chip-one">سبب</div><div className="floating-chip chip-two">دليل</div><div className="floating-chip chip-three">نتيجة</div>
            <div className="chain">
              {["سبب","حدث","قرار","نتيجة","أثر"].map((item, i) => <button key={item} className="chain-item" onClick={() => setView("map")} title={`استكشف ${item}`}><span>{String(i + 1).padStart(2, "0")}</span>{item}{i < 4 && <ChevronLeft size={16}/>}</button>)}
            </div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="section-head"><span className="eyebrow">رحلة المؤرخ</span><h2>حوّل المعلومة إلى تفسير</h2><p>تدرّب على بناء تفسير تاريخي خطوة بخطوة، من اكتشاف العوامل إلى الدفاع عن استنتاجك.</p></div>
          <div className="journey-grid">
            {STEPS.map((item, i) => <button className="journey-card" key={item} onClick={() => i === 0 ? startLesson() : setView(i === 1 ? "map" : i === 2 ? "why" : i === 3 ? "whatif" : "challenge")}><span className="journey-number">0{i + 1}</span><b>{item}</b><small>{["ابدأ من الحدث التاريخي","اكتشف العلاقات بين العوامل","فسّر كيف ولماذا","اختبر فرضية بديلة","قدّم تفسيرًا تدعمه الأدلة"][i]}</small><ArrowRight size={18}/></button>)}
          </div>
          <div className="feature-grid">
            {[
              [GitBranch, "الخريطة السببية", "حوّل المعلومات إلى علاقات بين أسباب وأحداث ونتائج."],
              [Brain, "مدرب التفكير", "أسئلة توجيهية تساعدك على بناء تفسيرك بنفسك."],
              [ShieldCheck, "الدليل أولًا", "ميّز بين المعلومة المسجلة والاستنتاج الذي يحتاج إلى دليل."],
              [Lightbulb, "ماذا لو؟", "اختبر سيناريوهات افتراضية مع تمييزها عن الوقائع التاريخية."]
            ].map(([Icon, title, desc]) => {
              const IconComponent = Icon as any;
              return <button className="feature" key={String(title)} onClick={() => setView(title === "الخريطة السببية" ? "map" : title === "مدرب التفكير" ? "chat" : title === "ماذا لو؟" ? "whatif" : "why")}><IconComponent size={25}/><h3>{String(title)}</h3><p>{String(desc)}</p><span>استكشف <ChevronLeft size={14}/></span></button>;
            })}
          </div>
        </section>

        <section className="section dark">
          <div className="section-head"><span className="eyebrow">محتوى تجريبي</span><h2>اختر درسًا وابدأ التحليل</h2><p>تحقق من محتوى الدرس المدرسي قبل اعتماد التفاصيل التجريبية مصدرًا نهائيًا.</p></div>
          <div className="lesson-grid">
            {UNIT6_LESSONS.map(item => <button className="lesson-card" key={item.id} onClick={() => startLesson(item)}><span>{item.subject} · {item.unit}</span><h3>{item.title}</h3><p>{item.description}</p><b>ابدأ التحليل <ChevronLeft size={16}/></b></button>)}
          </div>
        </section>
      </>}

      {view === "lesson" && <section className="workspace">
        <div className="workspace-head"><div><span className="eyebrow">رحلة المؤرخ</span><h1>{lesson.title}</h1><p>{lesson.description}</p></div><button className="secondary" onClick={() => setView("home")}>العودة للرئيسية</button></div>
        <div className="progress">{STEPS.map((s, i) => <button onClick={() => setStep(i)} className={i <= step ? "active" : ""} key={s}><span>{String(i + 1).padStart(2, "0")}</span>{s}</button>)}</div>
        {step === 0 && <div className="panel centered"><div className="event-icon"><Target size={34}/></div><h2>ابدأ من الحدث</h2><h3>{lesson.event}</h3><p>ما العوامل التي تعتقد أنها ساهمت في حدوث هذا الحدث؟ ابدأ بفرضيتك، ثم اختبرها بالأدلة.</p><button className="primary" onClick={() => setStep(1)}>اكتشف الأسباب</button></div>}
        {step === 1 && <div className="panel"><h2>اختر العوامل التي تراها مؤثرة</h2><p className="muted">يمكنك اختيار أكثر من عامل، ثم توضيح العلاقة بينه وبين الحدث.</p><div className="cause-grid">{lesson.causes.map(c => <button className={selectedCauses.includes(c.id) ? "cause selected" : "cause"} key={c.id} onClick={() => toggleCause(c.id)}><span className="tag">{c.category}</span><strong>{c.title}</strong><small>{c.description}</small>{selectedCauses.includes(c.id) && <CheckCircle2 size={18}/>}</button>)}</div><div className="selected-bar">تم اختيار {selectedCauses.length} عاملًا <button className="primary small" disabled={!selectedCauses.length} onClick={() => setStep(2)}>تابع إلى التفسير</button></div></div>}
        {step === 2 && <div className="panel"><h2>اشرح كيف أسهمت العوامل في الحدث</h2><div className="selected-list">{selectedCauseObjects.map(c => <span key={c.id}>{c.title}</span>)}</div><textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="أعتقد أن هذه العوامل أسهمت في الحدث لأن..." rows={5}/><button className="primary" onClick={() => { setLastEvaluation(evaluateAnswer(answer, lesson)); setStep(3); }}>راجع تفسيري</button>{evaluation && <EvaluationCard result={evaluation}/>}</div>}
        {step === 3 && <div className="panel centered"><Trophy size={36}/><h2>اختبر تفسيرك</h2><p>لا تعني النتيجة الرقمية وحدها أن التفسير صحيح تاريخيًا. راجع كل معيار، وطابقه مع نص الدرس.</p>{evaluation && <EvaluationCard result={evaluation}/>}<button className="primary" onClick={() => setView("challenge")}>انتقل إلى تحدي المؤرخ</button></div>}
        {step === 4 && <div className="panel centered"><h2>دافع عن تفسيرك</h2><p>ما الدليل الذي يدعم أقوى سبب اخترته؟ وما العامل الذي قد يغيّر تفسيرك؟</p><button className="primary" onClick={() => setView("challenge")}>ابدأ التحدي</button></div>}
      </section>}

      {view === "map" && <section className="workspace"><div className="workspace-head"><div><span className="eyebrow">اربط</span><h1>الخريطة السببية</h1><p>اختر عقدة لاستكشاف وصفها وعلاقتها بالحدث. البيانات الحالية تجريبية.</p></div><button className="secondary" onClick={() => setView("home")}>العودة</button></div><div className="panel"><h2>{lesson.title}</h2><CausalMap lesson={lesson} selectedNode={selectedNode} onSelect={setSelectedNode}/>{selectedNode && <div className="node-detail"><b>تفاصيل العقدة المحددة</b><p>{lesson.causes.find(c => c.id === selectedNode)?.description ?? lesson.consequences.find(c => c.id === selectedNode)?.description ?? lesson.event}</p><small>تحقق من العلاقة والدليل في الكتاب المدرسي قبل اعتمادها.</small></div>}</div></section>}

      {view === "why" && <section className="workspace"><div className="workspace-head"><div><span className="eyebrow">فسّر</span><h1>لماذا حدث ذلك؟</h1><p>انتقل من تسمية العامل إلى تفسير أثره.</p></div><button className="secondary" onClick={() => setView("home")}>العودة</button></div><div className="cause-grid">{lesson.causes.map(c => <article className="cause" key={c.id}><span className="tag">{c.category}</span><strong>{c.title}</strong><small>{c.description}</small><p><b>سؤال المؤرخ:</b> كيف ساهم هذا العامل في الحدث؟ ما الدليل الذي يدعم تفسيرك؟</p><button className="secondary small" onClick={() => { setChatInput(`كيف أسهم ${c.title} في ${lesson.event}؟`); setView("chat"); }}>ناقش العامل مع المؤرخ</button></article>)}</div></section>}

      {view === "whatif" && <section className="workspace"><div className="workspace-head"><div><span className="eyebrow">اختبر فرضية</span><h1>ماذا لو؟</h1><p>السيناريوهات التالية افتراضية وليست وقائع تاريخية.</p></div><button className="secondary" onClick={() => setView("home")}>العودة</button></div><div className="panel"><h2>ماذا لو غاب أحد العوامل عن {lesson.event}؟</h2><p>اختر عاملًا ثم اكتب فرضيتك، مع توضيح أنها افتراض لا حقيقة تاريخية.</p><div className="cause-grid">{lesson.causes.slice(0, 4).map(c => <button key={c.id} className={whatIf === c.id ? "cause selected" : "cause"} onClick={() => setWhatIf(c.id)}><strong>{c.title}</strong><small>{c.description}</small></button>)}</div>{whatIf && <div className="hypothesis-box"><b>فرضية للتفكير — ليست حقيقة تاريخية</b><p>إذا غاب عامل «{lesson.causes.find(c => c.id === whatIf)?.title}»، فقد يتغير تفسيرنا للحدث. ما النتائج المحتملة؟ وهل يوجد دليل يسمح بترجيح أحد الاحتمالات؟</p><textarea placeholder="أظن أن... لأن... لكن هذه فرضية تحتاج إلى تبرير..." rows={4}/></div>}</div></section>}

      {view === "challenge" && <section className="workspace"><div className="workspace-head"><div><span className="eyebrow">دافع عن تفسيرك</span><h1>تحدي المؤرخ</h1><p>اكتب تفسيرًا من 3–5 جمل، وميّز بين العامل والدليل والاستنتاج.</p></div><button className="secondary" onClick={() => setView("home")}>العودة</button></div><div className="challenge-order">{["السبب","العامل","الحدث","القرار","النتيجة"].map((x, i) => <div key={x}><span>{i + 1}</span>{x}</div>)}</div><div className="panel"><h2>لماذا حدث {lesson.event}؟</h2><textarea value={challengeText} onChange={e => setChallengeText(e.target.value)} placeholder="أفسر الحدث من خلال... والدليل الذي يدعم ذلك هو..." rows={6}/><button className="primary" onClick={() => setLastEvaluation(evaluateAnswer(challengeText, lesson))}>قيّم تفسيري</button>{lastEvaluation && <EvaluationCard result={lastEvaluation}/>}<p className="disclaimer">هذا تقييم إرشادي أولي يعتمد على مؤشرات نصية بسيطة، وليس حكمًا نهائيًا على صحة التفسير التاريخي.</p></div><button className="secondary next" onClick={() => setView("teacher")}>شاهد مؤشرات التقييم</button></section>}

      {view === "chat" && <section className="workspace chat-workspace"><div className="workspace-head"><div><span className="eyebrow"><MessageCircle size={14}/> مساعد التفكير التاريخي</span><h1>اسأل المؤرخ الذكي</h1><p>يساعدك على تحليل الأسباب والنتائج في الدرس المحدد، مع توضيح حدود النسخة التجريبية.</p></div><button className="secondary" onClick={() => setView("home")}>العودة</button></div><div className="chat-panel"><div className="chat-context"><BookOpen size={17}/><span>الدرس الحالي: <b>{lesson.title}</b></span><button onClick={() => setChatMessages([{ role: "assistant", text: "بدأنا محادثة جديدة. اسأل عن الأسباب أو النتائج، وسأرشدك إلى التفكير فيها." }])}><RotateCcw size={15}/> محادثة جديدة</button></div><div className="chat-messages">{chatMessages.map((m, i) => <div key={i} className={`chat-message ${m.role}`}><span className="chat-avatar">{m.role === "assistant" ? <Brain size={17}/> : "أنت"}</span><p>{m.text}</p></div>)}</div><div className="chat-suggestions">{["ما أبرز الأسباب؟","ما النتائج والآثار؟","كيف أستند إلى دليل؟"].map(q => <button key={q} onClick={() => setChatInput(q)}>{q}</button>)}</div><form className="chat-input-row" onSubmit={e => { e.preventDefault(); sendChat(); }}><input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="اكتب سؤالك التاريخي هنا..." aria-label="اكتب سؤالك"/><button className="primary" type="submit" disabled={!chatInput.trim()}><Send size={17}/> إرسال</button></form><p className="disclaimer">تنبيه: هذه نسخة تجريبية تعمل بردود محلية مبنية على بيانات الدرس، وليست متصلة حاليًا بنموذج ذكاء اصطناعي خارجي.</p></div></section>}

      {view === "teacher" && <section className="workspace"><div className="workspace-head"><div><span className="eyebrow">لوحة المعلم</span><h1>مؤشرات التفكير التاريخي</h1><p>المؤشرات التالية تجريبية وتُحسب من آخر إجابة قيّمتها؛ لا تمثل بيانات صف أو طلاب حقيقيين.</p></div><button className="secondary" onClick={() => setView("home")}>العودة</button></div>{evaluation ? <div className="panel"><h2>نتيجة آخر إجابة</h2><div className="score-summary"><strong>{evaluation.score}%</strong><span>{evaluation.label}</span></div><div className="skills">{Object.entries(evaluation.criteria).map(([key, value]) => <div className="skill" key={key}><div><b>{({ relevance: "صلة الإجابة بالدرس", causalLink: "تفسير العلاقة السببية", multipleFactors: "تعدد العوامل", evidence: "الإشارة إلى الدليل" } as Record<string, string>)[key]}</b><span>{value}%</span></div><div className="bar"><i style={{ width: `${value}%` }}/></div></div>)}</div><EvaluationCard result={evaluation}/></div> : <div className="panel centered"><Target size={36}/><h2>لا توجد نتيجة تقييم بعد</h2><p>قيّم إجابة في «رحلة المؤرخ» أو «تحدي المؤرخ» لتظهر المؤشرات هنا.</p><button className="primary" onClick={() => startLesson()}>ابدأ تقييمًا</button></div>}<p className="disclaimer">لا تستخدم هذه النسب لاتخاذ قرارات عالية الأثر بشأن الطلاب. يلزم اختبار rubric ومراجعة بشرية للتحقق من صلاحية التقييم.</p></section>}

      <footer className="site-footer"><span>المؤرخ الذكي — من حفظ الأحداث إلى تفسيرها</span><span>تصميم وتطوير: <b>عدي عبد الرحمن</b></span><button onClick={() => setView("home")}>الرئيسية ↑</button></footer>
    </main>
  );
}

function EvaluationCard({ result }: { result: ReturnType<typeof evaluateAnswer> }) {
  return <div className="evaluation-card"><div className="evaluation-title"><div><span className="eyebrow">تغذية راجعة إرشادية</span><h3>{result.label}</h3></div><strong>{result.score}%</strong></div><p className="disclaimer">درجة أولية مبنية على مؤشرات نصية؛ لا تثبت وحدها صحة المعلومات أو قوة الدليل.</p><div className="feedback-columns"><div><b>جوانب إيجابية</b>{result.strengths.map((x, i) => <p key={i}>✓ {x}</p>)}</div><div><b>خطوات للتحسين</b>{result.improvements.map((x, i) => <p key={i}>• {x}</p>)}</div></div></div>;
}
