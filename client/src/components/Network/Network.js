import React, { useState, useEffect } from "react";
import { connectionService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import ConnectionCard from "./ConnectionCard";
import PendingRequests from "./PendingRequests";
import LoadingSpinner from "../Common/LoadingSpinner";
import { Users, UserPlus, Search } from "lucide-react";
import "./Network.css";

const Network = () => {
  const { user } = useAuth();
  const { showNotification } = useApp();
  const [activeTab, setActiveTab] = useState("discover");
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadNetworkData();
  }, []);

  const loadNetworkData = async () => {
    try {
      setLoading(true);
      const [connectionsData, pendingData, suggestionsData] = await Promise.all(
        [
          connectionService.getConnections(),
          connectionService.getPendingRequests(),
          connectionService.getSuggestions(),
        ]
      );

      setConnections(connectionsData || []);
      setPendingRequests(pendingData || []);
      setSuggestions(suggestionsData || []);
    } catch (error) {
      console.error("Failed to load network data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (userId) => {
    try {
      await connectionService.sendRequest(userId);
      setSuggestions(suggestions.filter((s) => s._id !== userId));
      showNotification("Connection request sent", "success");
    } catch (error) {
      showNotification("Failed to send request", "error");
    }
  };

  const handleAcceptRequest = async (connectionId, userId) => {
    try {
      await connectionService.acceptRequest(connectionId);
      setPendingRequests(pendingRequests.filter((r) => r._id !== connectionId));
      showNotification("Connection request accepted", "success");
      loadNetworkData();
    } catch (error) {
      showNotification("Failed to accept request", "error");
    }
  };

  const handleRejectRequest = async (connectionId) => {
    try {
      await connectionService.rejectRequest(connectionId);
      setPendingRequests(pendingRequests.filter((r) => r._id !== connectionId));
      showNotification("Connection request rejected", "info");
    } catch (error) {
      showNotification("Failed to reject request", "error");
    }
  };

  const handleRemoveConnection = async (userId) => {
    if (window.confirm("Are you sure you want to remove this connection?")) {
      try {
        await connectionService.removeConnection(userId);
        setConnections(connections.filter((c) => c._id !== userId));
        showNotification("Connection removed", "success");
      } catch (error) {
        showNotification("Failed to remove connection", "error");
      }
    }
  };

  const filteredConnections = connections.filter(
    (connection) =>
      connection.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.headline?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuggestions = suggestions.filter(
    (suggestion) =>
      suggestion.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      suggestion.headline?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="network-page">
      <div className="network-container">
        <div className="network-sidebar">
          <h2>Manage my network</h2>
          <nav className="network-nav">
            <button
              className={`nav-button ${
                activeTab === "connections" ? "active" : ""
              }`}
              onClick={() => setActiveTab("connections")}
            >
              <Users size={20} />
              <span>Connections</span>
              <span className="count">{connections.length}</span>
            </button>
            <button
              className={`nav-button ${
                activeTab === "pending" ? "active" : ""
              }`}
              onClick={() => setActiveTab("pending")}
            >
              <UserPlus size={20} />
              <span>Pending</span>
              {pendingRequests.length > 0 && (
                <span className="count badge">{pendingRequests.length}</span>
              )}
            </button>
            <button
              className={`nav-button ${
                activeTab === "discover" ? "active" : ""
              }`}
              onClick={() => setActiveTab("discover")}
            >
              <Search size={20} />
              <span>Discover</span>
            </button>
          </nav>
        </div>

        <div className="network-main">
          {activeTab === "pending" && pendingRequests.length > 0 && (
            <PendingRequests
              requests={pendingRequests}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
            />
          )}

          <div className="network-header">
            <h1>
              {activeTab === "connections" &&
                `${connections.length} Connections`}
              {activeTab === "pending" &&
                `${pendingRequests.length} Pending Requests`}
              {activeTab === "discover" && "People You May Know"}
            </h1>
            {activeTab !== "pending" && (
              <div className="network-search">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search by name or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="network-grid">
            {activeTab === "connections" &&
              (filteredConnections.length > 0 ? (
                filteredConnections.map((connection) => (
                  <ConnectionCard
                    key={connection._id}
                    user={connection}
                    isConnected={true}
                    onRemove={() => handleRemoveConnection(connection._id)}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <Users size={48} />
                  <h3>No connections yet</h3>
                  <p>Start building your network by connecting with people</p>
                </div>
              ))}

            {activeTab === "pending" && pendingRequests.length === 0 && (
              <div className="empty-state">
                <UserPlus size={48} />
                <h3>No pending requests</h3>
                <p>
                  When people send you connection requests, they'll appear here
                </p>
              </div>
            )}

            {activeTab === "discover" &&
              (filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((suggestion) => (
                  <ConnectionCard
                    key={suggestion._id}
                    user={suggestion}
                    onConnect={() => handleConnect(suggestion._id)}
                  />
                ))
              ) : (
                <div className="empty-state">
                  <Search size={48} />
                  <h3>No suggestions available</h3>
                  <p>We'll suggest more people as you grow your network</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Network;
