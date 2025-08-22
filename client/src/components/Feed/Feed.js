import React, { useState, useEffect } from "react";
import { postService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import CreatePost from "./CreatePost";
import PostCard from "./PostCard";
import Sidebar from "../Layout/Sidebar";
import LoadingSpinner from "../Common/LoadingSpinner";
import NewsCard from "../Common/NewsCard";
import "./Feed.css";

const Feed = () => {
  const { user } = useAuth();
  const { showNotification } = useApp();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await postService.getFeed(page);

      if (isLoadMore) {
        setPosts((prev) => [...prev, ...response.posts]);
      } else {
        setPosts(response.posts || []);
      }

      setHasMore(response.hasMore || false);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load posts:", error);
      showNotification("Failed to load posts", "error");
      // Set empty array if error occurs
      if (!isLoadMore) {
        setPosts([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    showNotification("Post created successfully", "success");
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(
      posts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter((post) => post._id !== postId));
    showNotification("Post deleted", "success");
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="feed-container">
      <div className="feed-sidebar">
        <Sidebar />
      </div>

      <div className="feed-main">
        <CreatePost onPostCreated={handlePostCreated} />

        <div className="posts-list">
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onUpdate={handlePostUpdate}
                onDelete={handlePostDelete}
              />
            ))
          ) : (
            <div className="no-posts">
              <p>No posts to show</p>
              <p className="no-posts-subtitle">
                Start by creating your first post!
              </p>
            </div>
          )}
        </div>

        {hasMore && posts.length > 0 && (
          <div className="load-more-container">
            <button
              className="btn-load-more"
              onClick={() => loadPosts(true)}
              disabled={loadingMore}
            >
              {loadingMore ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>

      <div className="feed-right-sidebar">
        <NewsCard />
      </div>
    </div>
  );
};

export default Feed;
