import React, { useState, useEffect } from "react";
import { messageService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { Search, Edit } from "lucide-react";
import "./Messages.css";

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.userId);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      // Mock conversations for demo
      const mockConversations = [
        {
          userId: "1",
          user: {
            name: "John Doe",
            headline: "Software Engineer",
            profilePicture: null,
          },
          lastMessage: "Hey, how are you?",
          lastMessageTime: new Date(),
          unread: 2,
        },
        {
          userId: "2",
          user: {
            name: "Jane Smith",
            headline: "Product Manager",
            profilePicture: null,
          },
          lastMessage: "Let's schedule a call",
          lastMessageTime: new Date(Date.now() - 3600000),
          unread: 0,
        },
      ];
      setConversations(mockConversations);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId) => {
    try {
      // Mock messages for demo
      const mockMessages = [
        {
          _id: "1",
          sender: userId,
          recipient: user._id,
          message: "Hey, how are you?",
          createdAt: new Date(Date.now() - 7200000),
        },
        {
          _id: "2",
          sender: user._id,
          recipient: userId,
          message: "I'm doing great! How about you?",
          createdAt: new Date(Date.now() - 3600000),
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const handleSendMessage = async (message) => {
    try {
      const newMessage = {
        _id: Date.now().toString(),
        sender: user._id,
        recipient: selectedConversation.userId,
        message,
        createdAt: new Date(),
      };
      setMessages([...messages, newMessage]);

      // Update conversation
      const updatedConversations = conversations.map((conv) =>
        conv.userId === selectedConversation.userId
          ? { ...conv, lastMessage: message, lastMessageTime: new Date() }
          : conv
      );
      setConversations(updatedConversations);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="messages-sidebar">
          <div className="messages-header">
            <h2>Messaging</h2>
            <button className="new-message-btn">
              <Edit size={20} />
            </button>
          </div>

          <div className="messages-search">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search messages"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <ConversationList
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
          />
        </div>

        <div className="messages-main">
          {selectedConversation ? (
            <ChatWindow
              conversation={selectedConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUserId={user._id}
            />
          ) : (
            <div className="no-conversation">
              <h3>Select a message</h3>
              <p>Choose from your existing conversations or start a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
