import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import {
  User,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  LogOut,
  Shield,
  Briefcase,
} from "lucide-react";
import "./Layout.css";

const ProfileDropdown = ({ onClose }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className="profile-dropdown">
      <div className="dropdown-header">
        <div className="dropdown-user-info">
          <div className="dropdown-avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="dropdown-user-details">
            <h4>{user?.name}</h4>
            <p>{user?.headline || "Add a professional headline"}</p>
          </div>
        </div>
        <Link
          to={`/profile/${user._id}`}
          className="btn-view-profile"
          onClick={handleLinkClick}
        >
          View Profile
        </Link>
      </div>

      <div className="dropdown-section">
        <h5>Account</h5>
        <Link
          to="/premium"
          className="dropdown-item premium-item"
          onClick={handleLinkClick}
        >
          <div className="premium-icon">⭐</div>
          <span>Try Premium for free</span>
        </Link>
        <Link
          to="/settings"
          className="dropdown-item"
          onClick={handleLinkClick}
        >
          <Settings size={20} />
          <span>Settings & Privacy</span>
        </Link>
        <Link to="/help" className="dropdown-item" onClick={handleLinkClick}>
          <HelpCircle size={20} />
          <span>Help</span>
        </Link>
        <button
          className="dropdown-item"
          onClick={() => {
            toggleTheme();
            handleLinkClick();
          }}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          <span>{theme === "light" ? "Dark" : "Light"} Mode</span>
        </button>
      </div>

      <div className="dropdown-section">
        <h5>Manage</h5>
        <Link to="/company" className="dropdown-item" onClick={handleLinkClick}>
          <Briefcase size={20} />
          <span>Company Page</span>
        </Link>
        {user?.role === "job_poster" && (
          <Link
            to="/jobs/manage"
            className="dropdown-item"
            onClick={handleLinkClick}
          >
            <Shield size={20} />
            <span>Job Postings</span>
          </Link>
        )}
      </div>

      <div className="dropdown-footer">
        <button className="dropdown-item logout-item" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
