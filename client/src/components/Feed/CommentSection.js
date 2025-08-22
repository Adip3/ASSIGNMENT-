import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatDate, getInitials } from "../../utils/helpers";
import { Send, Loader } from "lucide-react";
import "./Feed.css";

const CommentSection = ({ postId, comments, onComment }) => {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) return;

    setLoading(true);
    try {
      await onComment(commentText);
      setCommentText("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section">
      <form onSubmit={handleSubmit} className="comment-form">
        <div className="comment-input-wrapper">
          <div className="comment-author-avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <input
            type="text"
            className="comment-input"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            className="comment-submit"
            disabled={loading || !commentText.trim()}
          >
            {loading ? (
              <Loader className="spinner" size={16} />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
      </form>

      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <Link
              to={`/profile/${comment.user._id}`}
              className="comment-author-avatar"
            >
              {comment.user.profilePicture ? (
                <img
                  src={comment.user.profilePicture}
                  alt={comment.user.name}
                />
              ) : (
                <span>{getInitials(comment.user.name)}</span>
              )}
            </Link>
            <div className="comment-content">
              <div className="comment-bubble">
                <Link
                  to={`/profile/${comment.user._id}`}
                  className="comment-author"
                >
                  {comment.user.name}
                </Link>
                <p className="comment-text">{comment.text}</p>
              </div>
              <span className="comment-time">
                {formatDate(comment.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
