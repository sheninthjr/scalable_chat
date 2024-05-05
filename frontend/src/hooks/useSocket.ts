import { useEffect, useState } from "react";

export const WS_URL = "ws://localhost:8080";
export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>();
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      setSocket(ws);
    };
    ws.onclose = () => {
      setSocket(null);
    };
  }, []);
  return socket;
};
