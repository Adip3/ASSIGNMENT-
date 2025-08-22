import React from "react";
import { Eye, Users, TrendingUp, Award } from "lucide-react";
import "./Profile.css";

const ProfileStats = ({ profile }) => {
  return (
    <div className="profile-stats-card">
      <h3>Dashboard</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <Eye size={20} />
          <div>
            <span className="stat-value">{profile.profileViews || 0}</span>
            <span className="stat-label">Profile views</span>
          </div>
        </div>

        <div className="stat-item">
          <Users size={20} />
          <div>
            <span className="stat-value">
              {profile.connections?.length || 0}
            </span>
            <span className="stat-label">Connections</span>
          </div>
        </div>

        <div className="stat-item">
          <TrendingUp size={20} />
          <div>
            <span className="stat-value">{profile.postImpressions || 0}</span>
            <span className="stat-label">Post impressions</span>
          </div>
        </div>

        <div className="stat-item">
          <Award size={20} />
          <div>
            <span className="stat-value">{profile.searchAppearances || 0}</span>
            <span className="stat-label">Search appearances</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
