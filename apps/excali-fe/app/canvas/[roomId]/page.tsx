"use client"
import { useEffect, useRef } from "react";

export default function CanvasPage() {

    const canvasref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (!canvasref.current) return;
        const canvas = canvasref.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return; 

        let clicked = false;
        let startx = 0, starty = 0;
        
        canvas.addEventListener("mousedown", (e: MouseEvent) => {
            startx = e.clientX;
            starty = e.clientY;
            clicked = true;
        })

        canvas.addEventListener("mouseup", (e: MouseEvent) => {
            clicked = false;
        })

        canvas.addEventListener("mousemove", (e: MouseEvent) => {
            
            if (!clicked) return;
            const width = e.clientX - startx;
            const height = e.clientY - starty;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeRect(startx, starty, width, height    );
           
        })

    },[canvasref])

  return <div>
    <canvas ref={canvasref} width={500} height={500}></canvas>
  </div>;
}