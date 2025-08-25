"use client"
import { useEffect, useRef, useState } from "react";
import { draw } from "../draw";
import { WS_URL, BACKEND_URL } from "../app/config";

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

export default function RoomCanvas({ slug }: { slug: string }) {
    const [roomId, setRoomId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const canvasref = useRef<HTMLCanvasElement>(null);
    const toolRef = useRef<"rect" | "circle" | "line" | "ellipse" | "triangle" | "arrow">("rect");
    const [tool, setTool] = useState<"rect" | "circle" | "line" | "ellipse" | "triangle" | "arrow">("rect");
    const [socket, setSocket] = useState<WebSocket | null>(null);

    // Fetch room by slug
    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/room/${slug}`);
                if (!response.ok) {
                    throw new Error('Room not found');
                }
                const data = await response.json();
                setRoomId(data.room.id);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch room');
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [slug]);

    useEffect(() => {
        if (!roomId) return;
        
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImppbUBnbWFpbC5jb20iLCJ1c2VySWQiOiI4MWY1MzNhNC1mNGVkLTQ5NmEtYTZlMi00OTFhNDcyNDI3N2EiLCJpYXQiOjE3NTYxMjA5NzV9.irtzgMwGY58v6Li8dzD3yzaWxy4tWqqbr2Ck5QkGUek`);
        ws.onopen = () => {
            setSocket(ws);
            ws.send(JSON.stringify({
                type: "join_room",
                roomId: roomId
            }));
        };
        ws.onerror = () => {
            try { ws.close(); } catch {}
        };
        return () => {
            try { ws.close(); } catch {}
        };
    }, [roomId]);

    useEffect(() => {
        if (!socket || !roomId) return;
        draw(canvasref, roomId, socket, toolRef);
    },[socket, roomId])

    useEffect(() => {
      toolRef.current = tool;
    }, [tool]);

    if (loading) {
      return (
        <div style={{ width: "100vw", height: "100vh", background: "black" }} className="flex items-center justify-center">
          <div className="text-white/70">Loading room...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ width: "100vw", height: "100vh", background: "black" }} className="flex items-center justify-center">
          <div className="text-white/70">Error: {error}</div>
        </div>
      );
    }

    if (!socket) {
      return (
        <div style={{ width: "100vw", height: "100vh", background: "black" }} className="flex items-center justify-center">
          <div className="text-white/70">Connecting...</div>
        </div>
      );
    }

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