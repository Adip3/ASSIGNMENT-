import React from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { getInitials, formatDate } from "../../utils/helpers";
import "./Network.css";

const PendingRequests = ({ requests, onAccept, onReject }) => {
  return (
    <div className="pending-requests">
      <h2>Invitations ({requests.length})</h2>
      <div className="requests-list">
        {requests.map((request) => (
          <div key={request._id} className="request-card">
            <Link
              to={`/profile/${request.requester._id}`}
              className="requester-avatar"
            >
              {request.requester.profilePicture ? (
                <img
                  src={request.requester.profilePicture}
                  alt={request.requester.name}
                />
              ) : (
                <span>{getInitials(request.requester.name)}</span>
              )}
            </Link>

            <div className="request-info">
              <Link
                to={`/profile/${request.requester._id}`}
                className="requester-name"
              >
                {request.requester.name}
              </Link>
              <p className="requester-headline">
                {request.requester.headline || "LinkedIn Member"}
              </p>
              {request.message && (
                <p className="request-message">"{request.message}"</p>
              )}
              <span className="request-time">
                {formatDate(request.createdAt)}
              </span>
            </div>

            <div className="request-actions">
              <button
                className="btn-ignore"
                onClick={() => onReject(request._id)}
                title="Ignore"
              >
                <X size={20} />
              </button>
              <button
                className="btn-accept"
                onClick={() => onAccept(request._id, request.requester._id)}
                title="Accept"
              >
                <Check size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRequests;
