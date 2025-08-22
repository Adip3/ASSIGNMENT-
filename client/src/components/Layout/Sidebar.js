import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Bookmark, Plus } from "lucide-react";
import "./Layout.css";

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-card profile-card">
        <div className="profile-banner"></div>
        <Link to={`/profile/${user._id}`} className="profile-info">
          <div className="profile-avatar-large">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <h3>{user?.name}</h3>
          <p>{user?.headline || "Add a professional headline"}</p>
        </Link>

        <div className="profile-stats">
          <Link to="/network" className="stat-item">
            <span>Connections</span>
            <span className="stat-value">{user?.connections?.length || 0}</span>
          </Link>
          <div className="stat-item">
            <span>Profile views</span>
            <span className="stat-value">{user?.profileViews || 0}</span>
          </div>
        </div>

        <Link to="/profile" className="sidebar-link">
          <Bookmark size={16} />
          <span>My items</span>
        </Link>
      </div>

      <div className="sidebar-card">
        <div className="sidebar-section">
          <h4>Recent</h4>
          <ul className="sidebar-list">
            <li>
              <Link to="/groups/react-developers"># react-developers</Link>
            </li>
            <li>
              <Link to="/groups/javascript"># javascript</Link>
            </li>
            <li>
              <Link to="/groups/web-development"># web-development</Link>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <Link to="/groups" className="sidebar-link groups-link">
            <span>Groups</span>
          </Link>
          <Link to="/events" className="sidebar-link">
            <span>Events</span>
            <Plus size={16} />
          </Link>
          <Link to="/hashtags" className="sidebar-link">
            <span>Followed Hashtags</span>
          </Link>
        </div>

        <Link to="/discover" className="sidebar-discover">
          Discover more
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
