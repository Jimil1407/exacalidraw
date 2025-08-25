"use client"
import { useEffect, useRef, useState } from "react";
import { draw } from "../../../draw";

const IconButton = ({
  title,
  active,
  onClick,
  children
}: { title: string; active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    title={title}
    onClick={onClick}
    className={`p-2 rounded ${active ? "bg-white/10" : "bg-transparent"}`}
    aria-pressed={active}
  >
    {children}
  </button>
);

export default function CanvasPage() {

    const canvasref = useRef<HTMLCanvasElement>(null);
    const toolRef = useRef<"rect" | "circle" | "line" | "ellipse" | "triangle" | "arrow">("rect");
    const [tool, setTool] = useState<"rect" | "circle" | "line" | "ellipse" | "triangle" | "arrow">("rect");

    useEffect(() => {
        draw(canvasref, toolRef);
    },[canvasref])

    useEffect(() => {
      toolRef.current = tool;
    }, [tool]);

  return <div style={{ width: "100vw", height: "100vh", background: "black" }}>
    <div
      style={{ position: "fixed", top: 16, left: "50%", transform: "translateX(-50%)" }}
      className="flex items-center gap-2 px-3 py-2 bg-black/80 border border-white/15 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm"
    >
      <IconButton title="Rectangle" active={tool === "rect"} onClick={() => setTool("rect")}> 
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="5" y="5" width="14" height="14"/></svg>
      </IconButton>
      <IconButton title="Circle" active={tool === "circle"} onClick={() => setTool("circle")}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="7"/></svg>
      </IconButton>
      <IconButton title="Ellipse" active={tool === "ellipse"} onClick={() => setTool("ellipse")}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><ellipse cx="12" cy="12" rx="8" ry="5"/></svg>
      </IconButton>
      <IconButton title="Triangle" active={tool === "triangle"} onClick={() => setTool("triangle")}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 5 L19 19 L5 19 Z"/></svg>
      </IconButton>
      <IconButton title="Line" active={tool === "line"} onClick={() => setTool("line")}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="5" y1="19" x2="19" y2="5"/></svg>
      </IconButton>
      <IconButton title="Arrow" active={tool === "arrow"} onClick={() => setTool("arrow")}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><path d="M16 9 L19 12 L16 15"/></svg>
      </IconButton>
    </div>
    <canvas ref={canvasref} style={{ display: "block", width: "100vw", height: "100vh" }}></canvas>
  </div>;
}