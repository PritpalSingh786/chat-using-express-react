// ChatDetail.jsx
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
  const { messages = [] } = useSelector((state) => state.messages || {});
  const [messageInput, setMessageInput] = useState("");

  // Register socket on userId change
  useEffect(() => {
    if (connectionId) {
      socket.emit("register", connectionId);
    }
  }, [connectionId, currentUserId]);

  // Receive incoming messages
  useEffect(() => {
    const handleMessage = (data) => {
      const localTime = new Date(Number(data.timestamp));
      const newMessage = {
        senderId: data.senderId,
        text: data.message,
        date: localTime.toLocaleDateString(),
        time: localTime.toLocaleTimeString(),
        isMe: data.senderId === currentUserId,
      };
      dispatch(addReceivedMessage(newMessage));
    };

    socket.on("receiveMessage", handleMessage);
    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, [currentUserId, dispatch]);

  // Fetch messages when user switches
  useEffect(() => {
    if (currentUserId && uuid) {
      dispatch(clearMessages());
      dispatch(fetchMessages({ senderId: currentUserId, receiverId: uuid }));
    }
  }, [dispatch, currentUserId, uuid]);

  const sendMessage = () => {
    if (messageInput.trim()) {
      socket.emit("sendMessage", {
        senderId: currentUserId,
        receiverConnectionId,
        receiverId: uuid,
        message: messageInput,
      });
      setMessageInput("");
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
