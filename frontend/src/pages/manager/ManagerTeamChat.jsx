import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import axiosInstance from "../../utils/axiosInstance";
import "./css/ManagerTeamChat.css";

export default function ManagerTeamChat() {
  const socketRef = useRef(null);

  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [activeRoom, setActiveRoom] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const userId = localStorage.getItem("userId");

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

  const loadRooms = async () => {
    const res = await axiosInstance.get("/team-chat/manager");
    setRooms(res.data);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const createRoom = async () => {
    if (!roomName.trim()) return;

    const res = await axiosInstance.post("/team-chat", { roomName });
    setRooms((prev) => [...prev, res.data]);
    setRoomName("");
  };

  const deleteRoom = async (roomId) => {
    await axiosInstance.delete(`/team-chat/${roomId}`);
    setRooms((prev) => prev.filter((r) => r._id !== roomId));
  };

  const openRoom = async (room) => {
    setActiveRoom(room);
    socketRef.current.emit("joinRoom", room._id);

    const res = await axiosInstance.get(`/team-chat/${room._id}`);
    setMessages(res.data.messages || []);
  };

  const sendMessage = () => {
    if (!message.trim() || !activeRoom) return;

    socketRef.current.emit("sendMessage", {
      roomId: activeRoom._id,
      message,
      senderId: userId,
      senderRole: "manager",
      senderName: localStorage.getItem("name"),
    });

    setMessage("");
  };

  return (
    <div className="chat-container">

      {/* LEFT SIDEBAR */}
      <div className="chat-sidebar">
        <h3>Rooms</h3>

        <div className="room-input">
          <input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Room name"
          />
          <button onClick={createRoom}>Create</button>
        </div>

        {rooms.map((r) => (
          <div key={r._id} className="room-item">
            <span onClick={() => openRoom(r)}>
              {r.roomName}
            </span>
            <button
              className="delete-btn"
              onClick={() => deleteRoom(r._id)}
            >
              X
            </button>
          </div>
        ))}
      </div>

      {/* RIGHT CHAT AREA */}
      <div className="chat-main">
        {activeRoom ? (
          <>
            <h3>{activeRoom.roomName}</h3>

            <div className="chat-messages">
              {messages.length === 0 && <p>No messages yet</p>}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`message ${
                    m.senderId === userId ? "manager" : "employee"
                  }`}
                >
                  <strong>{m.senderName}</strong>
                  <div>{m.message}</div>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a room to start chatting</p>
        )}
      </div>

    </div>
  );
}
