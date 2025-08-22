import { useState } from "react";
import { useEffect } from "react";
import { WS_URL } from "../app/config";

export function useSocket(){
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<WebSocket>();
    const token = process.env.WS_TOKEN;

    useEffect(() => {
        let url = `${WS_URL}?token=${token}`;
        try {
            const token = typeof window !== "undefined" ? window.localStorage.getItem("token") : null;
            if (token) {
                const separator = url.includes("?") ? "&" : "?";
                url = `${url}${separator}token=${encodeURIComponent(token)}`;
            }
        } catch {}

        const ws = new WebSocket(url);
        setSocket(ws);
        ws.onopen = () => {
            setLoading(false);
        };
        ws.onclose = () => {
            setLoading(true);
        };
        return () => {
            try { ws.close(); } catch {}
        };
    }, []);

    return {
        loading,
        socket
    }

}