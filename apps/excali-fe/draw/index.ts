import axios from "axios";
import { BACKEND_URL } from "../config";

type Shape = {
    type: "rect"
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle"
    x: number;
    y: number;
    radius: number;
} | {
    type: "line"
    x1: number;
    y1: number;
    x2: number;
    y2: number;
} | {
    type: "ellipse"
    x: number; // center x
    y: number; // center y
    rx: number;
    ry: number;
} | {
    type: "triangle"
    x1: number; y1: number;
    x2: number; y2: number;
    x3: number; y3: number;
} | {
    type: "arrow"
    x1: number; y1: number;
    x2: number; y2: number;
}

type ChatShape = { id: number; shape: Shape };

export const draw = async (
    canvasref: React.RefObject<HTMLCanvasElement | null>,
    roomId: number,
    socket: WebSocket,
    toolRef?: React.RefObject<"rect" | "circle" | "line" | "ellipse" | "triangle" | "arrow" | "eraser">,
) => {

    const shapes = await getShapes(roomId);
    const existingshapes = shapes as ChatShape[];
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if(message.type === "chat") {
            const payload = JSON.parse(message.message) as Shape;
            existingshapes.push({ id: message.chatId, shape: payload });
            redrawAll();
        }
        if (message.type === "erase") {
            const chatId: number = message.chatId;
            const idx = existingshapes.findIndex(s => s.id === chatId);
            if (idx !== -1) {
                existingshapes.splice(idx, 1);
                redrawAll();
            }
        }
    };

    if (!canvasref.current) return;
    const canvas = canvasref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; 

    const redrawAll = () => {
        clearCanvas(existingshapes, ctx, canvas);
    };

    const applyEraseAtPoint = (x: number, y: number) => {
        for (let i = existingshapes.length - 1; i >= 0; i--) {
            const s = existingshapes[i].shape as Shape;
            let hit = false;
            if (s.type === "rect") hit = pointInRect(x, y, s);
            else if (s.type === "circle") hit = pointInCircle(x, y, s);
            else if (s.type === "line") hit = pointOnLine(x, y, s);
            else if (s.type === "ellipse") hit = pointInEllipse(x, y, s);
            else if (s.type === "triangle") hit = pointInTriangle(x, y, s);
            else if (s.type === "arrow") hit = pointOnLine(x, y, s);
            if (hit) {
                existingshapes.splice(i, 1);
                redrawAll();
                break;
            }
        }
    };

    const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
        canvas.width = Math.floor(displayWidth * dpr);
        canvas.height = Math.floor(displayHeight * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // After resize, redraw existing content
        redrawAll();
    };

    resizeCanvas();

    let isDrawing = false;
    let startX = 0, startY = 0;

    const onMouseDown = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        isDrawing = true;
    };

    const onMouseUp = (e: MouseEvent) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const currX = e.clientX - rect.left;
        const currY = e.clientY - rect.top;
        const width = currX - startX;
        const height = currY - startY;
        const tool = toolRef?.current || "rect";
        if (tool === "eraser") {
            // Delete only if click is on a shape; find topmost hit
            let hitIndex = -1;
            for (let i = existingshapes.length - 1; i >= 0; i--) {
                const s = existingshapes[i].shape;
                let hit = false;
                if (s.type === "rect") hit = pointInRect(currX, currY, s);
                else if (s.type === "circle") hit = pointInCircle(currX, currY, s);
                else if (s.type === "line") hit = pointOnLine(currX, currY, s);
                else if (s.type === "ellipse") hit = pointInEllipse(currX, currY, s);
                else if (s.type === "triangle") hit = pointInTriangle(currX, currY, s);
                else if (s.type === "arrow") hit = pointOnLine(currX, currY, s);
                if (hit) { hitIndex = i; break; }
            }
            if (hitIndex !== -1) {
                const target = existingshapes[hitIndex];
                socket.send(JSON.stringify({
                    type: "erase",
                    roomId: roomId,
                    chatId: target.id
                }));
            }
            isDrawing = false;
            return;
        }
        let newShape: Shape | null = null;
        if (tool === "rect") {
            newShape = { type: "rect", x: startX, y: startY, width, height };
        } else if (tool === "circle") {
            const radius = Math.hypot(width, height);
            newShape = { type: "circle", x: startX, y: startY, radius };
        } else if (tool === "ellipse") {
            const rx = Math.abs(width);
            const ry = Math.abs(height);
            newShape = { type: "ellipse", x: startX, y: startY, rx, ry };
        } else if (tool === "line") {
            newShape = { type: "line", x1: startX, y1: startY, x2: currX, y2: currY };
        } else if (tool === "triangle") {
            newShape = { type: "triangle", x1: startX, y1: startY, x2: currX, y2: currY, x3: startX, y3: currY };
        } else if (tool === "arrow") {
            newShape = { type: "arrow", x1: startX, y1: startY, x2: currX, y2: currY };
        }
        if (newShape) {
            socket.send(JSON.stringify({
                type: "chat",
                roomId: roomId,
                message: JSON.stringify(newShape)
            }));
        }
        isDrawing = false;
    };

    const onMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const currX = e.clientX - rect.left;
        const currY = e.clientY - rect.top;
        
        if (!isDrawing) {
            // Show hover effect for eraser
            const tool = toolRef?.current || "rect";
            if (tool === "eraser") {
                redrawAll();
                // Highlight the shape under cursor
                for (let i = existingshapes.length - 1; i >= 0; i--) {
                    const s = existingshapes[i].shape;
                    let hit = false;
                    if (s.type === "rect") hit = pointInRect(currX, currY, s);
                    else if (s.type === "circle") hit = pointInCircle(currX, currY, s);
                    else if (s.type === "line") hit = pointOnLine(currX, currY, s);
                    else if (s.type === "ellipse") hit = pointInEllipse(currX, currY, s);
                    else if (s.type === "triangle") hit = pointInTriangle(currX, currY, s);
                    else if (s.type === "arrow") hit = pointOnLine(currX, currY, s);
                    if (hit) {
                        // Draw red outline around the shape that will be deleted
                        ctx.strokeStyle = "red";
                        ctx.lineWidth = 3;
                        if (s.type === "rect") {
                            ctx.strokeRect(s.x, s.y, s.width, s.height);
                        } else if (s.type === "circle") {
                            ctx.beginPath();
                            ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
                            ctx.stroke();
                        } else if (s.type === "line") {
                            ctx.beginPath();
                            ctx.moveTo(s.x1, s.y1);
                            ctx.lineTo(s.x2, s.y2);
                            ctx.stroke();
                        } else if (s.type === "ellipse") {
                            ctx.beginPath();
                            ctx.ellipse(s.x, s.y, s.rx, s.ry, 0, 0, Math.PI * 2);
                            ctx.stroke();
                        } else if (s.type === "triangle") {
                            ctx.beginPath();
                            ctx.moveTo(s.x1, s.y1);
                            ctx.lineTo(s.x2, s.y2);
                            ctx.lineTo(s.x3, s.y3);
                            ctx.closePath();
                            ctx.stroke();
                        } else if (s.type === "arrow") {
                            ctx.beginPath();
                            ctx.moveTo(s.x1, s.y1);
                            ctx.lineTo(s.x2, s.y2);
                            ctx.stroke();
                        }
                        break;
                    }
                }
            }
            return;
        }
        
        const width = currX - startX;
        const height = currY - startY;
        // Redraw existing shapes first
        redrawAll();
        // Then draw preview rectangle with white border
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        const tool = toolRef?.current || "rect";
        if (tool === "rect") {
            ctx.strokeRect(startX, startY, width, height);
        } else if (tool === "circle") {
            const radius = Math.hypot(width, height);
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            ctx.stroke();
        } else if (tool === "ellipse") {
            ctx.beginPath();
            ctx.ellipse(startX, startY, Math.abs(width), Math.abs(height), 0, 0, Math.PI * 2);
            ctx.stroke();
        } else if (tool === "line") {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(currX, currY);
            ctx.stroke();
        } else if (tool === "triangle") {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(currX, currY);
            ctx.lineTo(startX, currY);
            ctx.closePath();
            ctx.stroke();
        } else if (tool === "arrow") {
            // Draw line
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(currX, currY);
            ctx.stroke();
            // Arrowhead
            const angle = Math.atan2(currY - startY, currX - startX);
            const headLen = 12;
            const hx = currX;
            const hy = currY;
            ctx.beginPath();
            ctx.moveTo(hx, hy);
            ctx.lineTo(hx - headLen * Math.cos(angle - Math.PI / 6), hy - headLen * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(hx, hy);
            ctx.lineTo(hx - headLen * Math.cos(angle + Math.PI / 6), hy - headLen * Math.sin(angle + Math.PI / 6));
            ctx.stroke();
        }
    };

    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);

    return () => {
        window.removeEventListener("resize", resizeCanvas);
        canvas.removeEventListener("mousedown", onMouseDown);
        canvas.removeEventListener("mouseup", onMouseUp);
        canvas.removeEventListener("mousemove", onMouseMove);
     };
}

function clearCanvas(existingshapes: ChatShape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    existingshapes.forEach(({ shape }) => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
        if (shape.type === "circle") {
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
        if (shape.type === "line") {
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(shape.x1, shape.y1);
            ctx.lineTo(shape.x2, shape.y2);
            ctx.stroke();
        }
        if (shape.type === "ellipse") {
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(shape.x, shape.y, shape.rx, shape.ry, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        if (shape.type === "triangle") {
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(shape.x1, shape.y1);
            ctx.lineTo(shape.x2, shape.y2);
            ctx.lineTo(shape.x3, shape.y3);
            ctx.closePath();
            ctx.stroke();
        }
        if (shape.type === "arrow") {
            ctx.strokeStyle = "white";
            ctx.lineWidth = 2;
            // shaft
            ctx.beginPath();
            ctx.moveTo(shape.x1, shape.y1);
            ctx.lineTo(shape.x2, shape.y2);
            ctx.stroke();
            // head
            const angle = Math.atan2(shape.y2 - shape.y1, shape.x2 - shape.x1);
            const headLen = 12;
            ctx.beginPath();
            ctx.moveTo(shape.x2, shape.y2);
            ctx.lineTo(shape.x2 - headLen * Math.cos(angle - Math.PI / 6), shape.y2 - headLen * Math.sin(angle - Math.PI / 6));
            ctx.moveTo(shape.x2, shape.y2);
            ctx.lineTo(shape.x2 - headLen * Math.cos(angle + Math.PI / 6), shape.y2 - headLen * Math.sin(angle + Math.PI / 6));
            ctx.stroke();
        }
    });
}

function pointInRect(x: number, y: number, shape: Extract<Shape, { type: "rect" }>): boolean {
    const minX = Math.min(shape.x, shape.x + shape.width);
    const maxX = Math.max(shape.x, shape.x + shape.width);
    const minY = Math.min(shape.y, shape.y + shape.height);
    const maxY = Math.max(shape.y, shape.y + shape.height);
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

function pointInCircle(x: number, y: number, shape: Extract<Shape, { type: "circle" }>): boolean {
    const dx = x - shape.x;
    const dy = y - shape.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= shape.radius;
}

function pointOnLine(x: number, y: number, shape: Extract<Shape, { type: "line" | "arrow" }>, tolerance = 3): boolean {
    const { x1, y1, x2, y2 } = shape;
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;
    let xx, yy;
    if (param < 0) { xx = x1; yy = y1; }
    else if (param > 1) { xx = x2; yy = y2; }
    else { xx = x1 + param * C; yy = y1 + param * D; }
    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy) <= tolerance;
}

function pointInEllipse(x: number, y: number, shape: Extract<Shape, { type: "ellipse" }>): boolean {
    const dx = x - shape.x;
    const dy = y - shape.y;
    const normalizedX = dx / shape.rx;
    const normalizedY = dy / shape.ry;
    return (normalizedX * normalizedX + normalizedY * normalizedY) <= 1;
}

function pointInTriangle(x: number, y: number, shape: Extract<Shape, { type: "triangle" }>): boolean {
    const { x1, y1, x2, y2, x3, y3 } = shape;
    // Barycentric coordinate method
    const denominator = ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3));
    if (Math.abs(denominator) < 0.001) return false; // Degenerate triangle
    
    const u = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / denominator;
    const v = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / denominator;
    const w = 1 - u - v;
    
    return u >= 0 && v >= 0 && w >= 0;
}

// helper predicates used inside draw(); kept at module scope

async function getShapes(roomId: number) {
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    const messages: { id: number; message: string }[] = response.data.messages || [];

    // Replay events in chronological order so that erases apply correctly
    const chronological = [...messages].reverse();
    const accumulated: ChatShape[] = [];

    const eraseById = (arr: ChatShape[], id: number) => {
        const idx = arr.findIndex(s => s.id === id);
        if (idx !== -1) arr.splice(idx, 1);
    };

    for (const entry of chronological) {
        try {
            const payload = JSON.parse(entry.message);
            if (payload && payload._op === "erase_id" && typeof payload.id === "number") {
                eraseById(accumulated, payload.id);
            } else if (payload && typeof payload.type === "string") {
                accumulated.push({ id: (entry as any).id, shape: payload as Shape });
            }
        } catch {
            // ignore malformed payloads
        }
    }

    return accumulated;
}