import React, { useState, useEffect } from "react";
import { userService } from "../../services/api";
import { useApp } from "../../context/AppContext";
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
} from "lucide-react";
import { formatDate } from "../../utils/helpers";
import "./Admin.css";

const UserManagement = () => {
  const { showNotification } = useApp();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data || []);
    } catch (error) {
      console.error("Failed to load users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.deleteUser(userId);
        setUsers(users.filter((u) => u._id !== userId));
        showNotification("User deleted successfully", "success");
      } catch (error) {
        showNotification("Failed to delete user", "error");
      }
    }
  };

  const handleSuspendUser = async (userId) => {
    // Implement suspend functionality
    showNotification("User suspended", "success");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="user-management">
      <div className="management-header">
        <h1>User Management</h1>
        <div className="management-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="job_poster">Job Poster</option>
            <option value="job_seeker">Job Seeker</option>
          </select>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(filteredUsers.map((u) => u._id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user._id]);
                      } else {
                        setSelectedUsers(
                          selectedUsers.filter((id) => id !== user._id)
                        );
                      }
                    }}
                  />
                </td>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar-small">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={user.name} />
                      ) : (
                        <span>{user.name?.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    {user.name}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role?.replace("_", " ")}
                  </span>
                </td>
                <td>
                  <span className="status-badge active">Active</span>
                </td>
                <td>{formatDate(user.createdAt)}</td>
                <td>
                  <div className="table-actions">
                    <button className="action-btn" title="Edit">
                      <Edit size={16} />
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => handleSuspendUser(user._id)}
                      title="Suspend"
                    >
                      <Shield size={16} />
                    </button>
                    <button
                      className="action-btn danger"
                      onClick={() => handleDeleteUser(user._id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
