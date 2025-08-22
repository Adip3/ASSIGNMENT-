import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Paperclip, Send, Phone, Video } from "lucide-react";
import { formatDate, getInitials } from "../../utils/helpers";
import "./Messages.css";

const ChatWindow = ({
  conversation,
  messages,
  onSendMessage,
  currentUserId,
}) => {
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText("");
    }
  };

  const handleTyping = (e) => {
    setMessageText(e.target.value);
    // In a real app, you'd emit typing events here
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="chat-user-info">
          <div className="chat-avatar">
            {conversation.user.profilePicture ? (
              <img
                src={conversation.user.profilePicture}
                alt={conversation.user.name}
              />
            ) : (
              <span>{getInitials(conversation.user.name)}</span>
            )}
          </div>
          <div>
            <h3>{conversation.user.name}</h3>
            <p>{conversation.user.headline}</p>
          </div>
        </div>

        <div className="chat-actions">
          <button className="chat-action-btn">
            <Video size={20} />
          </button>
          <button className="chat-action-btn">
            <Phone size={20} />
          </button>
          <button className="chat-action-btn">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message ${
              message.sender === currentUserId ? "sent" : "received"
            }`}
          >
            <div className="message-content">
              <p>{message.message}</p>
              <span className="message-time">
                {formatDate(message.createdAt)}
              </span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-form">
        <button type="button" className="attachment-btn">
          <Paperclip size={20} />
        </button>
        <input
          type="text"
          placeholder="Write a message..."
          value={messageText}
          onChange={handleTyping}
          className="chat-input"
        />
        <button
          type="submit"
          className="send-btn"
          disabled={!messageText.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
