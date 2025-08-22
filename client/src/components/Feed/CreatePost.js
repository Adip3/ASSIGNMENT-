import React, { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { postService } from "../../services/api";
import { Image, Video, Calendar, FileText, X, Loader } from "lucide-react";
import "./Feed.css";

const CreatePost = ({ onPostCreated }) => {
  const { user } = useAuth();
  const { showNotification } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async () => {
    if (!content.trim() && !image) {
      showNotification("Please add some content or an image", "error");
      return;
    }

    setLoading(true);
    try {
      const postData = {
        content: content.trim(),
        image: imagePreview, // In production, you'd upload the image first
      };

      const newPost = await postService.createPost(postData);
      onPostCreated(newPost);

      // Reset form
      setContent("");
      setImage(null);
      setImagePreview(null);
      setShowModal(false);
    } catch (error) {
      showNotification("Failed to create post", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        showNotification("Image size should be less than 10MB", "error");
        return;
      }

      setImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className="create-post-card">
        <div className="create-post-input">
          <div className="user-avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.name} />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <button
            className="post-input-trigger"
            onClick={() => setShowModal(true)}
          >
            Start a post
          </button>
        </div>

        <div className="create-post-actions">
          <button
            className="post-action-btn"
            onClick={() => {
              setShowModal(true);
              setTimeout(() => fileInputRef.current?.click(), 100);
            }}
          >
            <Image size={20} color="#378fe9" />
            <span>Photo</span>
          </button>
          <button className="post-action-btn">
            <Video size={20} color="#5f9b41" />
            <span>Video</span>
          </button>
          <button className="post-action-btn">
            <Calendar size={20} color="#c37d16" />
            <span>Event</span>
          </button>
          <button className="post-action-btn">
            <FileText size={20} color="#e16745" />
            <span>Write article</span>
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={() => !loading && setShowModal(false)}
        >
          <div
            className="modal create-post-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Create a post</h2>
              <button
                className="modal-close"
                onClick={() => !loading && setShowModal(false)}
                disabled={loading}
              >
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="post-author-info">
                <div className="user-avatar">
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} />
                  ) : (
                    <span>{user?.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h4>{user?.name}</h4>
                  <button className="visibility-btn">🌐 Anyone</button>
                </div>
              </div>

              <textarea
                className="post-textarea"
                placeholder="What do you want to talk about?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
                autoFocus
              />

              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    className="remove-image"
                    onClick={removeImage}
                    disabled={loading}
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                style={{ display: "none" }}
              />
            </div>

            <div className="modal-footer">
              <div className="post-tools">
                <button
                  className="tool-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  <Image size={20} />
                </button>
                <button className="tool-btn" disabled={loading}>
                  <Video size={20} />
                </button>
                <button className="tool-btn" disabled={loading}>
                  <Calendar size={20} />
                </button>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading || (!content.trim() && !image)}
              >
                {loading ? (
                  <>
                    <Loader className="spinner" size={16} />
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePost;
