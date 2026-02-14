import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axiosInstance from "../../utils/axiosInstance";
import "./css/EmployeeChat.css";


export default function EmployeeChat() {
  const socketRef = useRef(null);

  const [rooms, setRooms] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);

  /* ================= SOCKET ================= */
  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    socketRef.current.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  /* ================= FETCH ROOMS ================= */
  useEffect(() => {
    axiosInstance
      .get("/team-chat/employee")
      .then((res) => setRooms(res.data))
      .catch(console.error);
  }, []);

  /* ================= JOIN ROOM ================= */
  const joinRoom = async (room) => {
    try {
      const res = await axiosInstance.get(`/team-chat/${room._id}`);

      setMessages(res.data.messages || []);
      setActiveRoom(room);

      socketRef.current.emit("joinRoom", room._id);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= CLOSE CHAT ================= */
  const closeChat = () => {
    setActiveRoom(null);
    setMessages([]);
  };

  /* ================= SEND MESSAGE ================= */
  const sendMessage = () => {
    if (!message.trim() || !activeRoom) return;

    socketRef.current.emit("sendMessage", {
      roomId: activeRoom._id,
      senderId: localStorage.getItem("userId"),
      senderRole: "employee",
      senderName: localStorage.getItem("name"),
      message,
    });

    setMessage("");
  };

  return (
    <div className="chat-container">

      {/* LEFT SIDEBAR */}
      <div className="chat-sidebar">
        <h3>Your Rooms</h3>
        {rooms.map((room) => (
          <div
            key={room._id}
            className={`room-item ${
              activeRoom?._id === room._id ? "active-room" : ""
            }`}
            onClick={() => joinRoom(room)}
          >
            {room.roomName}
          </div>
        ))}
      </div>

      {/* RIGHT SIDE */}
      <div className="chat-main">
        {!activeRoom ? (
          <h3>Select a room to start chatting</h3>
        ) : (
          <>
            <div className="chat-header">
              <h3>{activeRoom.roomName}</h3>
              <button className="close-btn" onClick={closeChat}>
                Close
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((m, i) => {
                const isMe = m.senderRole === "employee";

                return (
                  <div
                    key={i}
                    className={isMe ? "my-msg" : "other-msg"}
                  >
                    <div className="chat-bubble">
                      <small>{m.senderName}</small>
                      {m.message}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="chat-input-area">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
