import React from "react";
import { formatDate, getInitials } from "../../utils/helpers";
import "./Messages.css";

const ConversationList = ({
  conversations,
  selectedConversation,
  onSelectConversation,
}) => {
  return (
    <div className="conversation-list">
      {conversations.map((conversation) => (
        <div
          key={conversation.userId}
          className={`conversation-item ${
            selectedConversation?.userId === conversation.userId ? "active" : ""
          }`}
          onClick={() => onSelectConversation(conversation)}
        >
          <div className="conversation-avatar">
            {conversation.user.profilePicture ? (
              <img
                src={conversation.user.profilePicture}
                alt={conversation.user.name}
              />
            ) : (
              <span>{getInitials(conversation.user.name)}</span>
            )}
            {conversation.online && <span className="online-indicator"></span>}
          </div>

          <div className="conversation-info">
            <div className="conversation-header">
              <h4>{conversation.user.name}</h4>
              <span className="conversation-time">
                {formatDate(conversation.lastMessageTime)}
              </span>
            </div>
            <p className="conversation-preview">{conversation.lastMessage}</p>
          </div>

          {conversation.unread > 0 && (
            <span className="unread-badge">{conversation.unread}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
