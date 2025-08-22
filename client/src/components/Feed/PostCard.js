import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { postService } from "../../services/api";
import {
  Heart,
  MessageCircle,
  Share2,
  Send,
  MoreHorizontal,
  Trash2,
  Edit,
  Globe,
  Lock,
  Users,
} from "lucide-react";
import { formatDate, getInitials } from "../../utils/helpers";
import CommentSection from "./CommentSection";
import "./Feed.css";

const PostCard = ({ post, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const { showNotification } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(post.likes?.includes(user._id));
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [commentsCount, setCommentsCount] = useState(
    post.comments?.length || 0
  );

  const isOwner = post.author._id === user._id || user.role === "admin";

  const handleLike = async () => {
    try {
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

      const updatedPost = await postService.likePost(post._id);
      onUpdate(updatedPost);
    } catch (error) {
      // Revert on error
      setIsLiked(isLiked);
      setLikesCount(likesCount);
      showNotification("Failed to update like", "error");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postService.deletePost(post._id);
        onDelete(post._id);
      } catch (error) {
        showNotification("Failed to delete post", "error");
      }
    }
  };

  const handleComment = async (comment) => {
    try {
      const updatedPost = await postService.commentOnPost(post._id, comment);
      setCommentsCount(updatedPost.comments.length);
      onUpdate(updatedPost);
      showNotification("Comment added", "success");
    } catch (error) {
      showNotification("Failed to add comment", "error");
    }
  };

  const getVisibilityIcon = () => {
    switch (post.visibility) {
      case "connections":
        return <Users size={14} />;
      case "private":
        return <Lock size={14} />;
      default:
        return <Globe size={14} />;
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.author._id}`} className="post-author-link">
          <div className="post-author-avatar">
            {post.author.profilePicture ? (
              <img src={post.author.profilePicture} alt={post.author.name} />
            ) : (
              <span>{getInitials(post.author.name)}</span>
            )}
          </div>
          <div className="post-author-info">
            <h4>{post.author.name}</h4>
            <p>{post.author.headline}</p>
            <span className="post-meta">
              {formatDate(post.createdAt)} • {getVisibilityIcon()}
            </span>
          </div>
        </Link>

        {isOwner && (
          <div className="post-menu">
            <button
              className="post-menu-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreHorizontal size={20} />
            </button>
            {showMenu && (
              <div className="post-menu-dropdown">
                <button onClick={() => console.log("Edit post")}>
                  <Edit size={16} /> Edit post
                </button>
                <button onClick={handleDelete}>
                  <Trash2 size={16} /> Delete post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="post-content">
        <p className="post-text">{post.content}</p>
        {post.image && (
          <div className="post-image">
            <img src={post.image} alt="Post content" />
          </div>
        )}
      </div>

      {(likesCount > 0 || commentsCount > 0) && (
        <div className="post-stats">
          {likesCount > 0 && (
            <span className="stat-item">
              <span className="reaction-icons">👍❤️</span>
              {likesCount}
            </span>
          )}
          {commentsCount > 0 && (
            <button
              className="stat-item comments-count"
              onClick={() => setShowComments(!showComments)}
            >
              {commentsCount} comment{commentsCount !== 1 ? "s" : ""}
            </button>
          )}
        </div>
      )}

      <div className="post-actions">
        <button
          className={`post-action ${isLiked ? "liked" : ""}`}
          onClick={handleLike}
        >
          <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          <span>Like</span>
        </button>

        <button
          className="post-action"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={20} />
          <span>Comment</span>
        </button>

        <button className="post-action">
          <Share2 size={20} />
          <span>Repost</span>
        </button>

        <button className="post-action">
          <Send size={20} />
          <span>Send</span>
        </button>
      </div>

      {showComments && (
        <CommentSection
          postId={post._id}
          comments={post.comments || []}
          onComment={handleComment}
        />
      )}
    </div>
  );
};

export default PostCard;
