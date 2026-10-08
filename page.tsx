 "use client";

import { useMemo, useState } from "react";
import { BookOpen, Brain, ChevronLeft, CircleHelp, GitBranch, Lightbulb, Map, ShieldCheck, Sparkles, Target, Trophy } from "lucide-react";
import { UNIT6_LESSONS } from "../data/unit6";
import { CausalMap } from "../components/CausalMap";
import type { Lesson, ReasoningLabel } from "../types/historian";

const STEPS = ["اكتشف", "اربط", "فسّر", "اختبر", "دافع عن تفسيرك"];

function classifyAnswer(text: string): ReasoningLabel {
  const t = text.trim();
  if (!t) return "لم تُقدَّم إجابة";
  if (t.length < 35) return "إجابة صحيحة ولكن دون تفسير";
  if (/(لأن|بسبب|أدى|ساهم|نتج|أثر)/.test(t) && /(سياسي|اقتصاد|اجتماع|فكر|علم|تجاري|ثقاف)/.test(t))
    return "تفسير جيد ومدعوم";
  if (/(بسبب|لأن|أدى|ساهم|نتج)/.test(t)) return "تفسير جزئي";
  return "تفسير يحتاج إلى دليل";
}

export default function Home() {
  const [lesson, setLesson] = useState<Lesson>(UNIT6_LESSONS[0]);
  const [view, setView] = useState<"home"|"lesson"|"map"|"why"|"whatif"|"challenge"|"teacher">("home");
  const [step, setStep] = useState(0);
  const [selectedCauses, setSelectedCauses] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<ReasoningLabel | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [whatIf, setWhatIf] = useState<string | null>(null);
  const [challengeText, setChallengeText] = useState("");

  const selectedCauseObjects = useMemo(
    () => lesson.causes.filter(c => selectedCauses.includes(c.id)),
    [lesson, selectedCauses]
  );

  function startLesson(l: Lesson = lesson) {
    setLesson(l); setView("lesson"); setStep(0); setSelectedCauses([]); setAnswer(""); setFeedback(null); setSelectedNode(null); setWhatIf(null); setChallengeText("");
  }

  function toggleCause(id: string) {
    setSelectedCauses(v => v.includes(id) ? v.filter(x => x !== id) : [...v, id]);
    setStep(1);
  }

  function submitReasoning() {
    setFeedback(classifyAnswer(answer));
    setStep(2);
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand" onClick={() => setView("home")}>
          <div className="brand-mark"><Brain size={23}/></div>
          <div><b>المؤرخ الذكي</b><span>من حفظ الأحداث إلى تفسيرها</span></div>
        </div>
        <nav>
          <button onClick={() => setView("home")}>الرئيسية</button>
          <button onClick={() => setView("teacher")}>لوحة المعلم</button>
        </nav>
      </header>

      {view === "home" && (
        <>
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow"><Sparkles size={15}/> HISTORICAL REASONING LAB</div>
              <h1>المؤرخ الذكي</h1>
              <h2>من حفظ الأحداث إلى تفسيرها</h2>
              <p>استكشف الأحداث التاريخية، اكتشف أسبابها ونتائجها، وابنِ تفسيرك التاريخي بنفسك.</p>
              <div className="hero-actions">
                <button className="primary" onClick={() => startLesson()}><BookOpen size={18}/> ابدأ رحلة المؤرخ</button>
                <button className="secondary" onClick={() => document.getElementById("how")?.scrollIntoView({behavior:"smooth"})}><CircleHelp size={18}/> كيف يعمل؟</button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="chain">
                {["سبب","حدث","قرار","نتيجة","أثر"].map((x,i)=><div key={x} className="chain-item"><span>{i+1}</span>{x}{i<4 && <ChevronLeft size={18}/>}</div>)}
              </div>
              <div className="orbit"><Map size={62}/><span>دليل</span><span>سياق</span><span>سببية</span></div>
            </div>
          </section>

          <section className="section" id="how">
            <div className="section-head"><span className="eyebrow">WHY</span><h2>هل تعرف ماذا حدث؟</h2><p>جيد. لكن هل تستطيع تفسير لماذا حدث؟ وما الذي أدى إليه؟ وكيف ارتبط بالأحداث الأخرى؟</p></div>
            <div className="feature-grid">
              {[
                [GitBranch,"الخريطة السببية","حوّل المعلومات إلى علاقات بين أسباب وأحداث وقرارات ونتائج."],
                [Brain,"مدرب التفكير","لا يعطيك الإجابة مباشرة؛ يسألك ويحلل طريقة تفكيرك."],
                [ShieldCheck,"أدلة ومصادر","يفصل بين الحقيقة التاريخية والتفسير والاستنتاج والافتراض."],
                [Lightbulb,"ماذا لو؟","اختبر سيناريوهات بديلة مع تمييزها بصريًا عن التاريخ الفعلي."]
              ].map(([Icon,title,desc])=>{
                const I=Icon as any; return <div className="feature" key={String(title)}><I/><h3>{String(title)}</h3><p>{String(desc)}</p></div>
              })}
            </div>
          </section>

          <section className="section dark">
            <div className="section-head"><span className="eyebrow">الوحدة السادسة</span><h2>اختر درسًا تجريبيًا</h2><p>المحتوى التالي مستخلص من محاور الوحدة المرفقة، مع إبقاء التفاصيل التي تحتاج مراجعة الكتاب كمصادر قابلة للتحرير.</p></div>
            <div className="lesson-grid">
              {UNIT6_LESSONS.map(l=><button className="lesson-card" key={l.id} onClick={()=>startLesson(l)}>
                <span>{l.subject} · الوحدة السادسة</span><h3>{l.title}</h3><p>{l.description}</p><b>ابدأ التحليل ←</b>
              </button>)}
            </div>
          </section>
        </>
      )}

      {view === "lesson" && <section className="workspace">
        <div className="workspace-head"><div><span className="eyebrow">رحلة المؤرخ</span><h1>{lesson.title}</h1><p>{lesson.description}</p></div><button className="secondary" onClick={()=>setView("home")}>العودة</button></div>
        <div className="progress">{STEPS.map((s,i)=><div className={i<=step?"active":""} key={s}><span>{String(i+1).padStart(2,"0")}</span>{s}</div>)}</div>

        {step === 0 && <div className="panel centered"><div className="event-icon"><Target size={34}/></div><h2>ابدأ من الحدث</h2><h3>{lesson.event}</h3><p>لا تبحث عن الإجابة الآن. ابدأ كمؤرخ: ما العوامل التي تعتقد أنها ساهمت في حدوث هذا الحدث؟</p><button className="primary" onClick={()=>setStep(1)}>اكتشف الأسباب</button></div>}

        {step === 1 && <div className="panel"><h2>ما الأسباب التي تعتقد أنها ساهمت في الحدث؟</h2><p className="muted">اختر أكثر من عامل، ثم دافع عن اختيارك.</p><div className="cause-grid">{lesson.causes.map(c=><button className={selectedCauses.includes(c.id)?"cause selected":"cause"} key={c.id} onClick={()=>toggleCause(c.id)}><span className="tag">{c.category}</span><strong>{c.title}</strong><small>{c.description}</small></button>)}</div><div className="selected-bar">تم اختيار {selectedCauses.length} عاملًا <button className="primary small" disabled={!selectedCauses.length} onClick={()=>setStep(2)}>تابع إلى لماذا؟</button></div></div>}

        {step === 2 && <div className="panel"><div className="split"><div><h2>لماذا اخترت هذه العوامل؟</h2><p>اكتب تفسيرك. لا تحتاج إلى صياغة مثالية.</p><div className="selected-list">{selectedCauseObjects.map(c=><span key={c.id}>{c.title}</span>)}</div><textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="أعتقد أن هذه العوامل كانت مؤثرة لأن..." /><button className="primary" onClick={submitReasoning}>حلّل تفكيري</button>{feedback && <div className="feedback"><b>{feedback}</b><p>{feedback==="تفسير جيد ومدعوم"?"ربطت بين العامل والسياق وقدمت مؤشرات سببية واضحة.":feedback==="تفسير جزئي"?"فكرتك تحتوي على جزء صحيح. حاول ربط العامل بعامل آخر أو تقديم دليل.":"حاول الانتقال من ذكر العامل إلى شرح كيف ساهم في الحدث."}</p></div>}</div><div className="coach"><Brain/><h3>اسأل المؤرخ الذكي</h3><p>هل تستطيع التمييز بين السبب المباشر والعامل الذي ساهم في تهيئة الظروف؟</p><div className="hint">تلميح: اسأل نفسك «كيف؟» وليس «ماذا؟» فقط.</div></div></div><button className="secondary next" onClick={()=>setView("map")}>عرض الخريطة السببية</button></div>}

      </section>}

      {view === "map" && <section className="workspace"><div className="workspace-head"><div><span className="eyebrow">المرحلة 02 · اربط</span><h1>الخريطة السببية</h1><p>اضغط على أي عقدة لفحص علاقتها بالدليل.</p></div><button className="secondary" onClick={()=>setView("why")}>وضع لماذا؟</button></div><CausalMap lesson={lesson} selectedNode={selectedNode} onSelect={setSelectedNode}/>{selectedNode && <div className="node-detail"><b>{lesson.nodes.find(n=>n.id===selectedNode)?.title}</b><p>{lesson.nodes.find(n=>n.id===selectedNode)?.description}</p><span>نوع العلاقة: {lesson.nodes.find(n=>n.id===selectedNode)?.type}</span></div>}<button className="primary next" onClick={()=>setView("why")}>تابع إلى «لماذا؟»</button></section>}

      {view === "why" && <section className="workspace"><div className="workspace-head"><div><span className="eyebrow">المرحلة 03 · فسّر</span><h1>وضع «لماذا؟»</h1><p>ابنِ سلسلة سببية بدل الاكتفاء بذكر المعلومات.</p></div></div><div className="why-chain">{lesson.causes.slice(0,4).map(c=><div className="why-card" key={c.id}><span>{c.category}</span><h3>{c.title}</h3><p>لماذا كان هذا العامل موجودًا؟</p><div className="line"></div><p>كيف أثر في الحدث؟</p><div className="line"></div><p>ما الدليل الذي يدعم العلاقة؟</p></div>)}</div><button className="primary next" onClick={()=>setView("whatif")}>انتقل إلى «ماذا لو؟»</button></section>}

      {view === "whatif" && <section className="workspace"><div className="workspace-head"><div><span className="eyebrow">المرحلة 04 · اختبر</span><h1>ماذا لو؟</h1><p>هذه سيناريوهات افتراضية للتفكير وليست أحداثًا تاريخية فعلية.</p></div></div><div className="scenario-grid">{lesson.whatIf.map(w=><button className={whatIf===w.id?"scenario selected":"scenario"} key={w.id} onClick={()=>setWhatIf(w.id)}><span>سيناريو افتراضي</span><h3>{w.question}</h3><p>{w.options[0]}</p><p>{w.options[1]}</p><p>{w.options[2]}</p></button>)}</div>{whatIf && <div className="panel"><h3>دافع عن اختيارك</h3><textarea placeholder="اختر الاحتمال الأكثر منطقية واشرح لماذا..." /><div className="hint">تذكّر: لا توجد إجابة تاريخية مؤكدة لهذا السيناريو؛ المطلوب اختبار منطقك.</div></div>}<button className="primary next" onClick={()=>setView("challenge")}>تحدي المؤرخ</button></section>}

      {view === "challenge" && <section className="workspace"><div className="workspace-head"><div><span className="eyebrow">المرحلة 05 · دافع عن تفسيرك</span><h1>تحدي المؤرخ</h1><p>رتّب تفكيرك ثم اكتب تفسيرًا من 3–5 جمل.</p></div></div><div className="challenge-order">{["السبب","العامل","الحدث","القرار","النتيجة"].map((x,i)=><div key={x}><span>{i+1}</span>{x}</div>)}</div><div className="panel"><h2>فسّر في 3–5 جمل لماذا حدث هذا الحدث.</h2><p className="muted">استخدم سببًا أو أكثر، واربطها بالحدث، واستند إلى دليل من محتوى الدرس.</p><textarea value={challengeText} onChange={e=>setChallengeText(e.target.value)} placeholder="يُفسَّر الحدث من خلال..." /><button className="primary" onClick={()=>setFeedback(classifyAnswer(challengeText))}>قيّم تفسيري</button>{feedback && <div className="score-grid"><div><b>التفسير السببي</b><strong>{feedback==="تفسير جيد ومدعوم"?"85%":"60%"}</strong></div><div><b>التسلسل المنطقي</b><strong>{challengeText.length>60?"80%":"55%"}</strong></div><div><b>استخدام الأدلة</b><strong>{/دليل|مصدر|النص|الدرس/.test(challengeText)?"80%":"45%"}</strong></div><div><b>فهم السياق</b><strong>{selectedCauses.length>1?"75%":"55%"}</strong></div></div>}</div><button className="secondary next" onClick={()=>setView("teacher")}>شاهد أثر التعلم</button></section>}

      {view === "teacher" && <section className="workspace"><div className="workspace-head"><div><span className="eyebrow">لوحة المعلم · بيانات تجريبية</span><h1>مؤشرات التفكير التاريخي</h1><p>الأرقام التالية نموذجية في الـMVP وليست بيانات طلاب حقيقية.</p></div></div><div className="stats"><div><span>عدد الطلاب</span><b>24</b></div><div><span>متوسط الأداء</span><b>68%</b></div><div><span>إكمال الرحلة</span><b>79%</b></div><div><span>أكثر خطأ</span><b>السبب الأحادي</b></div></div><div className="skills">{[["التفسير السببي",58],["تحليل النتائج",71],["استخدام الأدلة",46],["الربط بين الأحداث",63]].map(([x,v])=><div className="skill" key={String(x)}><div><b>{String(x)}</b><span>{v}%</span></div><div className="bar"><i style={{width:`${v}%`}}/></div>)}</div><div className="recommendation"><Lightbulb/><div><b>التوصية التعليمية</b><p>يظهر ضعف نسبي في استخدام الأدلة التاريخية. اقترح نشاطًا قصيرًا لتحليل وثيقة تاريخية ومطابقة كل ادعاء بالدليل الذي يدعمه.</p></div></div><button className="primary next" onClick={()=>setView("home")}>العودة للرئيسية</button></section>}
    </main>
  );
}