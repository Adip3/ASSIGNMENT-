import React from "react";
import { TrendingUp, Users, FileText, Briefcase } from "lucide-react";
import "./Admin.css";

const Analytics = () => {
  return (
    <div className="analytics">
      <h1>Platform Analytics</h1>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>User Growth</h3>
          <div className="chart-placeholder">
            <TrendingUp size={48} />
            <p>User growth chart will be displayed here</p>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Engagement Rate</h3>
          <div className="chart-placeholder">
            <Users size={48} />
            <p>Engagement metrics will be displayed here</p>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Content Statistics</h3>
          <div className="chart-placeholder">
            <FileText size={48} />
            <p>Content statistics will be displayed here</p>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Job Market Trends</h3>
          <div className="chart-placeholder">
            <Briefcase size={48} />
            <p>Job market trends will be displayed here</p>
          </div>
        </div>
      </div>

      <div className="metrics-summary">
        <h2>Key Metrics</h2>
        <div className="metrics-list">
          <div className="metric-item">
            <span className="metric-label">Daily Active Users</span>
            <span className="metric-value">2,345</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Average Session Duration</span>
            <span className="metric-value">24 min</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Posts per Day</span>
            <span className="metric-value">156</span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Job Applications</span>
            <span className="metric-value">89</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
