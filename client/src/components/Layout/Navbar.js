import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import {
  Search,
  Home,
  Users,
  Briefcase,
  MessageSquare,
  Bell,
  Grid,
  ChevronDown,
} from "lucide-react";
import SearchBar from "../Common/SearchBar";
import ProfileDropdown from "./ProfileDropdown";
import "./Layout.css";

const Navbar = () => {
  const { user } = useAuth();
  const { unreadCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Users, label: "My Network", path: "/network" },
    { icon: Briefcase, label: "Jobs", path: "/jobs" },
    { icon: MessageSquare, label: "Messaging", path: "/messages" },
    {
      icon: Bell,
      label: "Notifications",
      path: "/notifications",
      badge: unreadCount,
    },
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/feed";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/" className="logo">
            <span>in</span>
          </Link>
          <SearchBar />
        </div>

        <div className="navbar-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
            >
              <div className="nav-item-icon">
                <item.icon size={24} />
                {item.badge > 0 && (
                  <span className="nav-badge">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-right">
          <div
            ref={profileMenuRef}
            className={`nav-item profile-nav ${
              showProfileMenu ? "active" : ""
            }`}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="nav-item-icon">
              <div className="nav-avatar">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} />
                ) : (
                  <span>{user?.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
            </div>
            <span className="nav-label">
              Me <ChevronDown size={16} />
            </span>
            {showProfileMenu && (
              <ProfileDropdown onClose={() => setShowProfileMenu(false)} />
            )}
          </div>

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`nav-item ${
                location.pathname.startsWith("/admin") ? "active" : ""
              }`}
            >
              <div className="nav-item-icon">
                <Grid size={24} />
              </div>
              <span className="nav-label">Admin</span>
            </Link>
          )}

          <div className="nav-divider"></div>

          <div className="nav-item work-nav">
            <div className="nav-item-icon">
              <Grid size={24} />
            </div>
            <span className="nav-label">
              Work <ChevronDown size={16} />
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
