"use client"
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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

export default function RoomCanvas({ slug, token }: { slug: string; token?: string }) {
    const [roomId, setRoomId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const canvasref = useRef<HTMLCanvasElement>(null);
    const toolRef = useRef<"rect" | "circle" | "line" | "ellipse" | "triangle" | "arrow" | "eraser" | "text" | "select">("rect");
    const [tool, setTool] = useState<"rect" | "circle" | "line" | "ellipse" | "triangle" | "arrow" | "eraser" | "text" | "select">("rect");
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [authToken, setAuthToken] = useState<string>(token || "");
    const [textOverlay, setTextOverlay] = useState<{ x: number; y: number; w?: number; h?: number } | null>(null);
    const [textValue, setTextValue] = useState("");
    const toolbarRef = useRef<HTMLDivElement>(null);
    const measureRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [textStart, setTextStart] = useState<{ x: number; y: number } | null>(null);

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
        // Load token from localStorage if not provided
        if (!token) {
            try {
                const saved = localStorage.getItem("token") || "";
                if (saved) setAuthToken(saved);
            } catch {}
        }
    }, [token]);

    useEffect(() => {
        if (!roomId) return;
        
        const t = token || authToken || "";
        if (!t) return;

        let reconnectAttempts = 0;
        const maxReconnectAttempts = 5;
        let reconnectTimeout: NodeJS.Timeout;

        const connectWebSocket = () => {
            try {
                const ws = new WebSocket(`${WS_URL}?token=${t}`);
                
                ws.onopen = () => {
                    setSocket(ws);
                    reconnectAttempts = 0;
                    ws.send(JSON.stringify({
                        type: "join_room",
                        roomId: roomId
                    }));
                };

                ws.onclose = (event) => {
                    setSocket(null);
                    
                    // Attempt to reconnect if not a normal closure
                    if (event.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
                        reconnectAttempts++;
                        reconnectTimeout = setTimeout(connectWebSocket, 1000 * reconnectAttempts);
                    }
                };

                ws.onerror = () => {
                    // Handle error silently
                };

                return ws;
            } catch {
                return null;
            }
        };

        const ws = connectWebSocket();

        return () => {
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            if (ws) {
                try { 
                    ws.close(1000, 'Component unmounting'); 
                } catch {
                    // Handle error silently
                }
            }
        };
    }, [roomId, token, authToken]);

    useEffect(() => {
        if (!socket || !roomId) return;
        draw(canvasref, roomId, socket, toolRef as unknown as React.RefObject<"rect" | "circle" | "line" | "ellipse" | "triangle" | "arrow" | "eraser" | "text">);
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
    <div style={{ position: "fixed", top: "calc(env(safe-area-inset-top) + 12px)", left: 12, zIndex: 40 }}>
      <Link href="/rooms" className="inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-cyan-300 hover:text-cyan-200 bg-black/70 border border-white/15 rounded-full backdrop-blur-sm">
        <span>←</span>
        <span>Back</span>
      </Link>
    </div>
    <div
      style={{ position: "fixed", top: "calc(env(safe-area-inset-top) + 12px)", left: "50%", transform: "translateX(-50%)" }}
      className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-black/80 border border-white/15 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-sm overflow-x-auto max-w-[90vw]"
      ref={toolbarRef}
    >
      <IconButton title="Rectangle" active={tool === "rect"} onClick={() => setTool("rect")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="5" y="5" width="14" height="14"/></svg>
      </IconButton>
      <IconButton title="Circle" active={tool === "circle"} onClick={() => setTool("circle")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><circle cx="12" cy="12" r="7"/></svg>
      </IconButton>
      <IconButton title="Ellipse" active={tool === "ellipse"} onClick={() => setTool("ellipse")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><ellipse cx="12" cy="12" rx="8" ry="5"/></svg>
      </IconButton>
      <IconButton title="Triangle" active={tool === "triangle"} onClick={() => setTool("triangle")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M12 5 L19 19 L5 19 Z"/></svg>
      </IconButton>
      <IconButton title="Line" active={tool === "line"} onClick={() => setTool("line")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="5" y1="19" x2="19" y2="5"/></svg>
      </IconButton>
      <IconButton title="Arrow" active={tool === "arrow"} onClick={() => setTool("arrow")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><path d="M16 9 L19 12 L16 15"/></svg>
      </IconButton>
      <IconButton title="Eraser" active={tool === "eraser"} onClick={() => setTool("eraser")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 16 L10 9 L15 14 L8 21 H3 Z"/></svg>
      </IconButton>
      <IconButton title="Text" active={tool === "text"} onClick={() => setTool("text")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 6 H20 M12 6 V20"/></svg>
      </IconButton>
      <IconButton title="Select" active={tool === "select"} onClick={() => setTool("select")}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 4 L12 12 L8 12 L12 20"/></svg>
      </IconButton>
    </div>
    <canvas
      ref={canvasref}
      style={{ display: "block", width: "100vw", height: "100vh", touchAction: "none", cursor: tool === "eraser" ? "crosshair" : (tool === "text" ? "text" : (tool === "select" ? "default" : "default")) }}
      onMouseDown={(e) => {
        if (toolRef.current !== "text" || !canvasref.current) return;
        const rect = canvasref.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setTextStart({ x, y });
      }}
      onTouchStart={(e) => {
        if (toolRef.current !== "text" || !canvasref.current) return;
        const t = e.touches[0];
        const rect = canvasref.current.getBoundingClientRect();
        const x = t.clientX - rect.left;
        const y = t.clientY - rect.top;
        setTextStart({ x, y });
      }}
      onMouseUp={(e) => {
        if (toolRef.current !== "text" || !canvasref.current || !textStart) return;
        const rect = canvasref.current.getBoundingClientRect();
        const x2 = e.clientX - rect.left;
        const y2 = e.clientY - rect.top;
        // normalize rect
        const x = Math.min(textStart.x, x2);
        let y = Math.min(textStart.y, y2);
        let w = Math.abs(x2 - textStart.x);
        let h = Math.abs(y2 - textStart.y);
        // minimum size
        if (w < 24) w = 24;
        if (h < 18) h = 18;
        // clamp below toolbar
        const toolbar = toolbarRef.current;
        if (toolbar) {
          const tRect = toolbar.getBoundingClientRect();
          const minY = tRect.bottom - rect.top + 8;
          if (y < minY) y = minY;
        }
        setTextOverlay({ x, y, w, h });
        setTextValue("");
        setTextStart(null);
        setTimeout(() => inputRef.current?.focus(), 0);
      }}
      onTouchEnd={(e) => {
        if (toolRef.current !== "text" || !canvasref.current || !textStart) return;
        const rect = canvasref.current.getBoundingClientRect();
        // use changedTouches for end point
        const t = e.changedTouches[0];
        const x2 = t.clientX - rect.left;
        const y2 = t.clientY - rect.top;
        const x = Math.min(textStart.x, x2);
        let y = Math.min(textStart.y, y2);
        let w = Math.abs(x2 - textStart.x);
        let h = Math.abs(y2 - textStart.y);
        if (w < 24) w = 24;
        if (h < 18) h = 18;
        const toolbar = toolbarRef.current;
        if (toolbar) {
          const tRect = toolbar.getBoundingClientRect();
          const minY = tRect.bottom - rect.top + 8;
          if (y < minY) y = minY;
        }
        setTextOverlay({ x, y, w, h });
        setTextValue("");
        setTextStart(null);
        setTimeout(() => inputRef.current?.focus(), 0);
      }}
      onMouseMove={undefined}
    ></canvas>
    {textOverlay && (
      <>
        {/* hidden measurer for dynamic width/height */}
        <span
          ref={measureRef}
          style={{
            position: "fixed",
            left: "-9999px",
            top: "-9999px",
            whiteSpace: "pre",
            font: "16px Inter, Arial, sans-serif",
            lineHeight: "18px",
          }}
        >{textValue || " "}</span>
        <textarea
          ref={inputRef}
          value={textValue}
          onChange={(e) => {
            setTextValue(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const payload = { type: "text", x: textOverlay.x, y: textOverlay.y, text: textValue.trim() };
              if (payload.text) {
                socket?.send(JSON.stringify({ type: "chat", roomId, message: JSON.stringify(payload) }));
              }
              setTextOverlay(null);
              setTextValue("");
            } else if (e.key === "Escape") {
              setTextOverlay(null);
              setTextValue("");
            }
          }}
          style={{
            position: "fixed",
            left: `${textOverlay.x}px`,
            top: `${textOverlay.y}px`,
            background: "transparent",
            color: "white",
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "2px 4px",
            outline: "none",
            minWidth: "24px",
            width: `${Math.min(Math.max(Math.max((measureRef.current?.offsetWidth || 0) + 8, (textOverlay.w ?? 24)), 24), window.innerWidth - textOverlay.x - 8)}px`,
            font: "16px Inter, Arial, sans-serif",
            lineHeight: "18px",
            height: "18px",
            resize: "none",
            overflow: "hidden",
            whiteSpace: "pre",
            zIndex: 30,
          }}
          rows={1}
        />
      </>
    )}
  </div>;
}