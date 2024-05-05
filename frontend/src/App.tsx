import { useEffect, useState } from "react";
import { useSocket } from "./hooks/useSocket";

function App() {
  const socket = useSocket();
  const [chat, setChat] = useState("");
  const userId = crypto.randomUUID();
  const [message, setMessage] = useState<string[]>([]);
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event: any) => {
        const data = event.data;
        setMessage((prevData) => [...prevData, data]);
      };
    }
  }, [socket]);
  const handleSocket = () => {
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "1",
            userId,
          },
        })
      );
    }
  };
  const sendMessage = () => {
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "message",
          payload: {
            roomId: "1",
            userId,
            chat,
          },
        })
      );
    }
  };
  return (
    <>
      <button onClick={handleSocket}>Start</button>
      <input
        value={chat}
        placeholder="Enter the message"
        onChange={(e) => setChat(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      {message}
    </>
  );
}

export default App;
