import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  MoreVertical,
  UserMinus,
  MessageCircle,
} from "lucide-react";
import { getInitials } from "../../utils/helpers";
import "./Network.css";

const ConnectionCard = ({
  user,
  isConnected,
  onConnect,
  onRemove,
  mutualConnections,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="connection-card">
      <div className="card-banner"></div>

      {isConnected && (
        <div className="card-menu">
          <button
            className="menu-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical size={20} />
          </button>
          {showMenu && (
            <div className="menu-dropdown">
              <button>
                <MessageCircle size={16} />
                Message
              </button>
              <button onClick={onRemove}>
                <UserMinus size={16} />
                Remove Connection
              </button>
            </div>
          )}
        </div>
      )}

      <Link to={`/profile/${user._id}`} className="card-avatar">
        {user.profilePicture ? (
          <img src={user.profilePicture} alt={user.name} />
        ) : (
          <span>{getInitials(user.name)}</span>
        )}
      </Link>

      <div className="card-info">
        <Link to={`/profile/${user._id}`} className="user-name">
          {user.name}
        </Link>
        <p className="user-headline">{user.headline || "LinkedIn Member"}</p>

        {(user.location || user.company) && (
          <div className="user-meta">
            {user.location && (
              <span>
                <MapPin size={14} />
                {user.location}
              </span>
            )}
            {user.company && (
              <span>
                <Briefcase size={14} />
                {user.company}
              </span>
            )}
          </div>
        )}

        {mutualConnections > 0 && (
          <p className="mutual-connections">
            {mutualConnections} mutual connection
            {mutualConnections > 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="card-actions">
        {isConnected ? (
          <Link to={`/messages?user=${user._id}`} className="btn btn-outline">
            Message
          </Link>
        ) : (
          <button className="btn btn-primary" onClick={onConnect}>
            Connect
          </button>
        )}
      </div>
    </div>
  );
};

export default ConnectionCard;
