export const draw = (canvasref: React.RefObject<HTMLCanvasElement | null>) => {
    if (!canvasref.current) return;
    const canvas = canvasref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return; 

    const resizeCanvas = () => {
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = window.innerWidth;
        const displayHeight = window.innerHeight;
        canvas.style.width = `${displayWidth}px`;
        canvas.style.height = `${displayHeight}px`;
        canvas.width = Math.floor(displayWidth * dpr);
        canvas.height = Math.floor(displayHeight * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, displayWidth, displayHeight);
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

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, width, height);
        isDrawing = false;
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const currX = e.clientX - rect.left;
        const currY = e.clientY - rect.top;
        const width = currX - startX;
        const height = currY - startY;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, startY, width, height);
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