 "use client";
import { ArrowLeft, CircleDot } from "lucide-react";
import type { Lesson } from "../types/historian";

export function CausalMap({ lesson, selectedNode, onSelect }: { lesson: Lesson; selectedNode: string|null; onSelect:(id:string)=>void }) {
  return (
    <div className="graph-wrap">
      <div className="graph">
        <div className="graph-column causes">
          <h4>الأسباب</h4>
          {lesson.causes.slice(0,5).map(c=><button key={c.id} className={selectedNode===c.id?"node selected":"node"} onClick={()=>onSelect(c.id)}><CircleDot size={15}/><span>{c.title}</span></button>)}
        </div>
        <div className="arrows"><ArrowLeft/><ArrowLeft/><ArrowLeft/><ArrowLeft/></div>
        <button className={selectedNode==="event"?"event-node selected":"event-node"} onClick={()=>onSelect("event")}><small>الحدث التاريخي</small><b>{lesson.event}</b></button>
        <div className="arrows"><ArrowLeft/><ArrowLeft/><ArrowLeft/></div>
        <div className="graph-column results">
          <h4>النتائج والآثار</h4>
          {lesson.consequences.slice(0,4).map(c=><button key={c.id} className={selectedNode===c.id?"node selected":"node"} onClick={()=>onSelect(c.id)}><CircleDot size={15}/><span>{c.title}</span></button>)}
        </div>
      </div>
    </div>
  );
}
