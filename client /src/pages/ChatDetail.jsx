import React, { useEffect, useState } from "react";
import socket from "./socket";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  addReceivedMessage,
  clearMessages,
} from "../features/message/messageSlice";
import "./ChatDetail.css";

const ChatDetail = ({
  userId,
  receiverConnectionId,
  currentUserId,
  connectionId,
  uuid,
}) => {
  const dispatch = useDispatch();

  // 👇 Use safe fallback in case state.messages is undefined
  const { messages = [] } = useSelector((state) => state.messages || {});
  const [messageInput, setMessageInput] = useState("");

  // 🟡 Register socket and listen for incoming messages
  useEffect(() => {
    if (connectionId) {
      socket.emit("register", connectionId);
    }

    const handleMessage = (data) => {
      const localTime = new Date(Number(data.timestamp));
      const newMessage = {
        senderId: data.senderId,
        senderName: data.senderName,
        text: data.message,
        time: localTime.toLocaleTimeString(),
        date: localTime.toLocaleDateString(),
        isMe: data.senderId === currentUserId,
      };
      dispatch(addReceivedMessage(newMessage));
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [connectionId, currentUserId, dispatch]);

  // 🟡 Fetch previous messages when chat opens
  useEffect(() => {
    if (currentUserId && uuid) {
      dispatch(clearMessages()); // Clear old messages when switching users
      dispatch(fetchMessages({ senderId: currentUserId, receiverId: uuid }));
    }
  }, [dispatch, currentUserId, uuid]);

  // 🟡 Send message via socket
  const sendMessage = () => {
    if (messageInput.trim()) {
      socket.emit("sendMessage", {
        senderId: currentUserId,
        receiverConnectionId,
        receiverId: uuid,
        message: messageInput,
      });

      setMessageInput(""); // Clear input box
    }
  };

  return (
    <div className="chat-detail-container">
      <h2 className="chat-detail-title">Chat with {userId}</h2>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.isMe ? "me" : "other"}`}>
            <div className="chat-meta">
              <strong>{msg.isMe ? "You" : userId}</strong> • {msg.date} {msg.time}
            </div>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} disabled={!messageInput.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatDetail;
