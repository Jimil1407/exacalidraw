"use client"
import { use } from "react";
import RoomCanvas from "../../../components/RoomCanvas";

export default function CanvasPage({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId: slug } = use(params);
    return <RoomCanvas slug={slug} />;
}