import React, { useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";
import "./Common.css";

const NotificationToast = () => {
  const { notifications, removeNotification } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <AlertCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification-toast ${notification.type}`}
        >
          {getIcon(notification.type)}
          <span>{notification.message}</span>
          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
