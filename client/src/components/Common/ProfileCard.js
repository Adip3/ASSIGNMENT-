import React from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { getInitials } from "../../utils/helpers";
import "./Common.css";

const ProfileCard = ({ user }) => {
  return (
    <div className="profile-card">
      <div className="profile-card-banner"></div>
      <Link to={`/profile/${user._id}`} className="profile-card-info">
        <div className="profile-card-avatar">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.name} />
          ) : (
            <span>{getInitials(user?.name)}</span>
          )}
        </div>
        <h3>{user?.name}</h3>
        <p>{user?.headline || "Add a professional headline"}</p>
      </Link>

      <div className="profile-card-stats">
        <Link to="/network" className="stat-link">
          <span>Connections</span>
          <span className="stat-value">{user?.connections?.length || 0}</span>
        </Link>
        <div className="stat-link">
          <span>Profile views</span>
          <span className="stat-value">{user?.profileViews || 0}</span>
        </div>
      </div>

      <Link to="/saved" className="profile-card-link">
        <Bookmark size={16} />
        <span>My items</span>
      </Link>
    </div>
  );
};

export default ProfileCard;
