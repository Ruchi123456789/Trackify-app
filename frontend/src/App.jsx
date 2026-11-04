import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // const [senderName, setSenderName] = useState("Mona");

    const senderName =
    new URLSearchParams(window.location.search).get("user") || "Ruchi";

const roomId = "Room A";

  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("connected ", socket.id);
    });

    socket.emit("joinRoom", roomId);

    socket.on("roomJoined", (room) => {
    console.log("Joined room:", room);
});
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        message
      ])
    })
    return () => {
      socket.disconnect();
    }
  }, []);

  const sendMessage = () => {

    if (!message.trim()) return;

    // We'll add socket.emit here in the next step.

    socketRef.current.emit("sendMessage", {roomId, message, senderName});
   // socketRef.current.emit("ruvu", message);
    setMessage("");

  };

  return (
    <div>
      <h2>Trackify Live connection..</h2>

      {/* <select value={senderName} onChange={(e) => setSenderName(e.target.value)}>
        <option value="Ruchi">Ruchi</option>
        <option value="Mona">Mona</option>
      </select> */}

      <input type="text" placeholder="Enter message" value={message} onChange={(e) => { setMessage(e.target.value) }} />

      <button onClick={sendMessage}>
        Send
      </button>

      <h3>Messages:</h3>
      {/* <ul>
        {messages.map((msg, index) => (
          <li key={index}>
            <b>{msg.senderName}:</b> {msg.message}
          </li>
        ))}
      </ul> */}

<div>
    {messages.map((msg, index) => (
        <div
            key={index}
            style={{
                display: "flex",
                justifyContent:
                    msg.senderName === senderName
                        ? "flex-end"
                        : "flex-start",
                margin: "10px"
            }}
        >
            <div style={{
                background: msg.senderName === senderName
                    ? "lightgreen"
                    : "lightgray",
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "60%"
            }}>
                <b>{msg.senderName}</b>
                <p>{msg.message}</p>
            </div>
        </div>
    ))}
</div>

    </div>
  )
}

export default App;