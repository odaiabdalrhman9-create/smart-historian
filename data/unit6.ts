
export type LessonCause = {
  id: string;
  title: string;
  category: "سياسي" | "اقتصادي" | "اجتماعي" | "فكري" | "عسكري" | "أخرى";
  description: string;
  evidence: string[];
};

export type LessonConsequence = {
  id: string;
  title: string;
  type: "مباشرة" | "بعيدة المدى" | "غير مباشرة";
  description: string;
  evidence: string[];
};

export type HistoricalLesson = {
  id: string;
  subject: string;
  grade: string;
  unit: string;
  title: string;
  description: string;
  event: string;
  causes: LessonCause[];
  consequences: LessonConsequence[];
  historicalContext: string;
  questions: string[];
};

export const UNIT6_LESSONS: HistoricalLesson[] = [
  {
    id: "lesson-1",
    subject: "التاريخ",
    grade: "يُحدَّد وفق المنهاج",
    unit: "الوحدة السادسة",
    title: "تحليل حدث تاريخي",
    description:
      "نشاط تدريبي تجريبي لتعلم تحليل الأحداث التاريخية وربط الأسباب بالنتائج.",
    event: "حدث تاريخي يحتاج إلى تحديد من الدرس المدرسي",
    historicalContext:
      "يجب إدخال الزمان والمكان والأطراف والمعلومات الواردة في المصدر المدرسي قبل استخدام هذا النشاط بوصفه محتوى تاريخيًا.",
    causes: [
      {
        id: "cause-1",
        title: "العوامل السابقة للحدث",
        category: "سياسي",
        description:
          "حلّل الظروف السياسية السابقة للحدث، ولا تفترض وجود سبب محدد دون دليل من المصدر.",
        evidence: [],
      },
      {
        id: "cause-2",
        title: "العوامل الاقتصادية والاجتماعية",
        category: "اقتصادي",
        description:
          "افحص الظروف الاقتصادية والاجتماعية التي قد تساعد في تفسير الحدث إذا وردت في المادة التعليمية.",
        evidence: [],
      },
    ],
    consequences: [
      {
        id: "result-1",
        title: "النتائج المباشرة",
        type: "مباشرة",
        description:
          "حدّد ما حدث مباشرة بعد الواقعة بالاستناد إلى المعلومات الواردة في الدرس.",
        evidence: [],
      },
      {
        id: "result-2",
        title: "الآثار بعيدة المدى",
        type: "بعيدة المدى",
        description:
          "حلّل الآثار اللاحقة التي يذكرها المصدر، وميّزها عن النتائج المباشرة.",
        evidence: [],
      },
    ],
    questions: [
      "ما الحدث التاريخي الذي تحلّله؟",
      "ما الأسباب التي يذكرها المصدر؟",
      "ما الدليل الذي يدعم تفسيرك؟",
      "ما الفرق بين النتيجة المباشرة والأثر بعيد المدى؟",
      "هل يمكن تفسير الحدث بأكثر من سبب؟ وضّح استنادًا إلى المصدر.",
    ],
  },
];
