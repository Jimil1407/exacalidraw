"use client"
import { useEffect, useRef } from "react";
import { draw } from "../../../draw";
export default function CanvasPage() {

    const canvasref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        draw(canvasref);

    },[canvasref])

  return <div style={{ width: "100vw", height: "100vh" }}>
    <canvas ref={canvasref} style={{ display: "block" }}></canvas>
  </div>;
}