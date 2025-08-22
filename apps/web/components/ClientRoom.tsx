"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ClientRoom({
    messages,
    id
}:{
    messages: {message: string}[],
    id: string
}){

    const {loading, socket} = useSocket();
    const [chats, setChats] = useState(messages);
    const [currentmsg, setCuurentmsg] = useState("");

    useEffect(() => {

        if(socket && !loading){
            console.log("join room message sent");

            const numericRoomId = Number(id);
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({ type: "join_room", roomId: numericRoomId }));
            } else {
                socket.onopen = () => {
                    socket.send(JSON.stringify({ type: "join_room", roomId: numericRoomId }));
                };
            }
            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data)
                if(parsedData.type  == "chat"){
                    setChats(c => [...c, { message: parsedData.message }])

                }
            }
        }

    },[loading,socket])

    return <div>
        {chats.map((m, idx) => <div key={idx}>{m.message}</div>)}
        <input type="text" placeholder="Type the message" value={currentmsg} onChange={(e) => { setCuurentmsg(e.target.value) }} />
        <button onClick={() => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "chat",
                    roomId: Number(id),
                    message: currentmsg
                }));
                
            }
            setCuurentmsg("");
        }}>Send Message</button>
    </div>


}