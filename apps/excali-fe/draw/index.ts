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

export const draw = async (
    canvasref: React.RefObject<HTMLCanvasElement | null>,
    roomId: number,
    socket: WebSocket,
    toolRef?: React.RefObject<"rect" | "circle" | "line" | "ellipse" | "triangle" | "arrow">,
) => {

    const shapes = await getShapes(roomId);
    const existingshapes = shapes as Shape[];
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if(message.type === "chat") {
            const shape = JSON.parse(message.message);
            existingshapes.push(shape);
            redrawAll();
        }
    };

    if (!canvasref.current) return;
    const canvas = canvasref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; 

    const redrawAll = () => {
        clearCanvas(existingshapes, ctx, canvas);
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
        if (tool === "rect") {
            existingshapes.push({
                type: "rect",
                x: startX,
                y: startY,
                width,
                height
            });
        } else if (tool === "circle") {
            const radius = Math.hypot(width, height);
            existingshapes.push({
                type: "circle",
                x: startX,
                y: startY,
                radius
            });
        } else if (tool === "ellipse") {
            const rx = Math.abs(width);
            const ry = Math.abs(height);
            // center at start
            existingshapes.push({
                type: "ellipse",
                x: startX,
                y: startY,
                rx,
                ry
            });
        } else if (tool === "line") {
            existingshapes.push({
                type: "line",
                x1: startX,
                y1: startY,
                x2: currX,
                y2: currY
            });
        } else if (tool === "triangle") {
            // Right triangle using start and current with third at (startX, currY)
            existingshapes.push({
                type: "triangle",
                x1: startX, y1: startY,
                x2: currX,  y2: currY,
                x3: startX, y3: currY
            });
        } else if (tool === "arrow") {
            existingshapes.push({
                type: "arrow",
                x1: startX, y1: startY,
                x2: currX,  y2: currY
            });
        }
        // Redraw all finalized shapes
        redrawAll();
        // axios.post(`${BACKEND_URL}/chats/${roomId}`, {
        //     message: JSON.stringify(existingshapes[existingshapes.length - 1])
        // });
        socket.send(JSON.stringify({
            type: "chat",
            roomId: roomId,
            message: JSON.stringify(existingshapes[existingshapes.length - 1])
        }));  
        isDrawing = false;
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const currX = e.clientX - rect.left;
        const currY = e.clientY - rect.top;
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

function clearCanvas(existingshapes: Shape[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    existingshapes.forEach(shape => {
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

async function getShapes(roomId: number) {
    const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    const messages = response.data.messages;


    const shapes = messages.map((x: {message: string}) => {
        const shape = JSON.parse(x.message);
        return shape;
    });
    return shapes;
}