import React, { useState, useEffect } from "react";
import { notificationService } from "../../services/api";
import { formatDate } from "../../utils/helpers";
import {
  Bell,
  BellOff,
  Check,
  X,
  UserPlus,
  Heart,
  MessageCircle,
  Briefcase,
} from "lucide-react";
import "./Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to load notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(
        notifications.map((n) =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "connection":
        return <UserPlus size={20} />;
      case "like":
        return <Heart size={20} />;
      case "comment":
        return <MessageCircle size={20} />;
      case "job":
        return <Briefcase size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  if (loading) {
    return (
      <div className="notifications-loading">Loading notifications...</div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <div className="notifications-actions">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
          </select>
          <button onClick={markAllAsRead} className="btn-mark-all">
            <Check size={16} /> Mark all as read
          </button>
        </div>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="no-notifications">
            <BellOff size={48} />
            <p>No notifications to show</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`notification-item ${
                !notification.read ? "unread" : ""
              }`}
              onClick={() => !notification.read && markAsRead(notification._id)}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">
                  {formatDate(notification.createdAt)}
                </span>
              </div>
              {!notification.read && (
                <div className="notification-unread-indicator"></div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
