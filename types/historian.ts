export type ReasoningLabel =
  | "تفسير قوي"
  | "تفسير جزئي"
  | "تفسير يحتاج إلى دليل"
  | "خلط بين السبب والنتيجة"
  | "تفسير أحادي السبب"
  | "إجابة صحيحة ولكن دون تفسير"
  | "تفسير جيد ومدعوم"
  | "لم تُقدَّم إجابة";

export type Cause = {
  id: string; title: string; category: string; description: string;
  importance: string; relatedEvent: string; evidence: string[]; source: string;
};

export type Consequence = {
  id: string; title: string; type: string; description: string; evidence: string[]; source: string;
};

export type Node = { id: string; title: string; type: string; description: string; };

export type WhatIf = { id: string; question: string; options: string[]; };

export type Lesson = {
  id: string; subject: string; grade: string; unit: string; title: string;
  description: string; event: string; causes: Cause[]; consequences: Consequence[];
  nodes: Node[]; whatIf: WhatIf[];
};
