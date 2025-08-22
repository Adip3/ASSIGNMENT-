import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import UserManagement from "./UserManagement";
import Analytics from "./Analytics";
import {
  Users,
  BarChart2,
  FileText,
  Settings,
  Shield,
  TrendingUp,
  Activity,
  DollarSign,
  Briefcase,
} from "lucide-react";
import "./Admin.css";

const Dashboard = () => {
  const location = useLocation();
  const [stats, setStats] = useState({
    totalUsers: 1234,
    activeUsers: 892,
    totalJobs: 89,
    totalPosts: 456,
    revenue: 54320,
    growth: 12.5,
  });

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav className="admin-nav">
          <Link
            to="/admin"
            className={`admin-nav-item ${isActive("/admin") ? "active" : ""}`}
          >
            <BarChart2 size={20} />
            Overview
          </Link>
          <Link
            to="/admin/users"
            className={`admin-nav-item ${
              isActive("/admin/users") ? "active" : ""
            }`}
          >
            <Users size={20} />
            Users
          </Link>
          <Link
            to="/admin/analytics"
            className={`admin-nav-item ${
              isActive("/admin/analytics") ? "active" : ""
            }`}
          >
            <Activity size={20} />
            Analytics
          </Link>
          <Link
            to="/admin/content"
            className={`admin-nav-item ${
              isActive("/admin/content") ? "active" : ""
            }`}
          >
            <FileText size={20} />
            Content
          </Link>
          <Link
            to="/admin/settings"
            className={`admin-nav-item ${
              isActive("/admin/settings") ? "active" : ""
            }`}
          >
            <Settings size={20} />
            Settings
          </Link>
        </nav>
      </div>

      <div className="admin-main">
        <Routes>
          <Route path="/" element={<Overview stats={stats} />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/content" element={<ContentModeration />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </div>
    </div>
  );
};

const Overview = ({ stats }) => (
  <div className="admin-overview">
    <h1>Dashboard Overview</h1>

    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon users">
          <Users size={24} />
        </div>
        <div className="stat-content">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers.toLocaleString()}</p>
          <span className="stat-change positive">+{stats.growth}%</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon active">
          <Activity size={24} />
        </div>
        <div className="stat-content">
          <h3>Active Users</h3>
          <p className="stat-number">{stats.activeUsers.toLocaleString()}</p>
          <span className="stat-change positive">+8.2%</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon jobs">
          <Briefcase size={24} />
        </div>
        <div className="stat-content">
          <h3>Job Postings</h3>
          <p className="stat-number">{stats.totalJobs}</p>
          <span className="stat-change negative">-2.4%</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon revenue">
          <DollarSign size={24} />
        </div>
        <div className="stat-content">
          <h3>Revenue</h3>
          <p className="stat-number">${stats.revenue.toLocaleString()}</p>
          <span className="stat-change positive">+15.3%</span>
        </div>
      </div>
    </div>

    <div className="recent-activity">
      <h2>Recent Activity</h2>
      <div className="activity-list">
        <div className="activity-item">
          <Shield size={16} />
          <span>New user registered: john.doe@example.com</span>
          <time>2 minutes ago</time>
        </div>
        <div className="activity-item">
          <FileText size={16} />
          <span>Job posted: Senior Developer at TechCorp</span>
          <time>15 minutes ago</time>
        </div>
        <div className="activity-item">
          <Users size={16} />
          <span>User suspended: spam@example.com</span>
          <time>1 hour ago</time>
        </div>
      </div>
    </div>
  </div>
);

const ContentModeration = () => (
  <div className="content-moderation">
    <h1>Content Moderation</h1>
    <p>Manage reported content and posts</p>
    {/* Add content moderation functionality */}
  </div>
);

const AdminSettings = () => (
  <div className="admin-settings">
    <h1>Admin Settings</h1>
    <p>Configure platform settings</p>
    {/* Add settings functionality */}
  </div>
);

export default Dashboard;
