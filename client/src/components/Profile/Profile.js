import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  userService,
  connectionService,
  postService,
} from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import EditProfile from "./EditProfile";
import ProfileStats from "./ProfileStats";
import LoadingSpinner from "../Common/LoadingSpinner";
import PostCard from "../Feed/PostCard";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  Calendar,
  Edit,
  UserPlus,
  MessageCircle,
  MoreHorizontal,
  Mail,
  Phone,
  Globe,
} from "lucide-react";
import { formatDate, getInitials } from "../../utils/helpers";
import "./Profile.css";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const { showNotification } = useApp();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("about");
  const [showEditModal, setShowEditModal] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("none"); // none, pending, connected

  const profileId = id || currentUser._id;
  const isOwnProfile = profileId === currentUser._id;

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    try {
      setLoading(true);

      // If viewing own profile and no ID in URL, use current user data
      if (isOwnProfile && !id) {
        // Use the current user data from auth context
        setProfile(currentUser);

        // Optionally fetch fresh data from server
        try {
          const profileData = await userService.getProfile("me");
          setProfile(profileData);
        } catch (error) {
          console.log("Using cached user data");
        }
      } else {
        // Fetch other user's profile
        try {
          const profileData = await userService.getProfile(profileId);
          setProfile(profileData);
        } catch (error) {
          console.error("Error fetching profile:", error);

          // If API fails and it's own profile, use current user data
          if (isOwnProfile) {
            setProfile(currentUser);
          } else {
            throw error;
          }
        }
      }

      // Check connection status
      if (!isOwnProfile && profile) {
        if (profile.connections?.includes(currentUser._id)) {
          setConnectionStatus("connected");
        } else if (profile.pendingConnections?.includes(currentUser._id)) {
          setConnectionStatus("pending");
        }
      }

      // Load user's posts (mock for now)
      setPosts([]);
    } catch (error) {
      console.error("Failed to load profile:", error);
      showNotification("Failed to load profile", "error");

      // Only navigate away if it's not the user's own profile
      if (!isOwnProfile) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      await connectionService.sendConnectionRequest(profileId);
      setConnectionStatus("pending");
      showNotification("Connection request sent", "success");
    } catch (error) {
      showNotification("Failed to send connection request", "error");
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const updated = await userService.updateProfile(updatedData);
      setProfile(updated);
      setShowEditModal(false);
      showNotification("Profile updated successfully", "success");
    } catch (error) {
      showNotification("Failed to update profile", "error");
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  // If no profile data, show the current user data for own profile
  const displayProfile = profile || (isOwnProfile ? currentUser : null);

  if (!displayProfile) {
    return (
      <div className="profile-error">
        <h2>Profile not found</h2>
        <p>The profile you're looking for doesn't exist.</p>
        <button onClick={() => navigate("/")} className="btn btn-primary">
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-main-card">
          <div className="profile-cover">
            <div className="cover-image"></div>
            {isOwnProfile && (
              <button className="edit-cover-btn">
                <Edit size={16} />
              </button>
            )}
          </div>

          <div className="profile-header">
            <div className="profile-avatar-container">
              <div className="profile-avatar-xlarge">
                {displayProfile.profilePicture ? (
                  <img
                    src={displayProfile.profilePicture}
                    alt={displayProfile.name}
                  />
                ) : (
                  <span>{getInitials(displayProfile.name)}</span>
                )}
              </div>
            </div>

            <div className="profile-header-info">
              <h1>{displayProfile.name}</h1>
              <p className="profile-headline">
                {displayProfile.headline ||
                  (isOwnProfile
                    ? "Add a professional headline"
                    : `${displayProfile.role || "Professional"}`)}
              </p>

              <div className="profile-location-info">
                {displayProfile.location && (
                  <span>
                    <MapPin size={16} />
                    {displayProfile.location}
                  </span>
                )}
                {displayProfile.company && (
                  <span>
                    <Briefcase size={16} />
                    {displayProfile.company}
                  </span>
                )}
                <span className="connections-count">
                  {displayProfile.connections?.length || 0} connections
                </span>
              </div>

              <div className="profile-actions">
                {isOwnProfile ? (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowEditModal(true)}
                    >
                      <Edit size={16} />
                      Edit profile
                    </button>
                    <button className="btn btn-outline">
                      Add profile section
                    </button>
                    <button className="btn btn-outline">
                      <MoreHorizontal size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    {connectionStatus === "connected" ? (
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate(`/messages?user=${profileId}`)}
                      >
                        <MessageCircle size={16} />
                        Message
                      </button>
                    ) : connectionStatus === "pending" ? (
                      <button className="btn btn-outline" disabled>
                        Pending
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={handleConnect}
                      >
                        <UserPlus size={16} />
                        Connect
                      </button>
                    )}
                    <button className="btn btn-outline">
                      <MoreHorizontal size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="profile-tabs">
            <button
              className={`tab-button ${activeTab === "about" ? "active" : ""}`}
              onClick={() => setActiveTab("about")}
            >
              About
            </button>
            <button
              className={`tab-button ${
                activeTab === "experience" ? "active" : ""
              }`}
              onClick={() => setActiveTab("experience")}
            >
              Experience
            </button>
            <button
              className={`tab-button ${
                activeTab === "education" ? "active" : ""
              }`}
              onClick={() => setActiveTab("education")}
            >
              Education
            </button>
            <button
              className={`tab-button ${activeTab === "skills" ? "active" : ""}`}
              onClick={() => setActiveTab("skills")}
            >
              Skills
            </button>
            <button
              className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </button>
          </div>

          <div className="profile-content">
            {activeTab === "about" && (
              <section className="profile-section">
                <h2>About</h2>
                <p className="about-text">
                  {displayProfile.summary ||
                    (isOwnProfile
                      ? "Add a summary about yourself"
                      : "No summary available")}
                </p>
              </section>
            )}

            {activeTab === "experience" && (
              <section className="profile-section">
                <h2>Experience</h2>
                {displayProfile.experience &&
                displayProfile.experience.length > 0 ? (
                  <div className="experience-list">
                    {displayProfile.experience.map((exp, index) => (
                      <div key={index} className="experience-item">
                        <div className="company-logo">
                          <Briefcase size={24} />
                        </div>
                        <div className="experience-details">
                          <h3>{exp.title}</h3>
                          <p className="company-name">{exp.company}</p>
                          <p className="date-location">
                            {exp.startDate && formatDate(exp.startDate)} -{" "}
                            {exp.current
                              ? "Present"
                              : exp.endDate && formatDate(exp.endDate)}
                            {exp.location && ` • ${exp.location}`}
                          </p>
                          {exp.description && (
                            <p className="experience-description">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-section">
                    {isOwnProfile
                      ? "Add your work experience"
                      : "No experience listed"}
                  </p>
                )}
              </section>
            )}

            {activeTab === "education" && (
              <section className="profile-section">
                <h2>Education</h2>
                {displayProfile.education &&
                displayProfile.education.length > 0 ? (
                  <div className="education-list">
                    {displayProfile.education.map((edu, index) => (
                      <div key={index} className="education-item">
                        <div className="school-logo">
                          <GraduationCap size={24} />
                        </div>
                        <div className="education-details">
                          <h3>{edu.school}</h3>
                          <p className="degree">
                            {edu.degree} {edu.field && `in ${edu.field}`}
                          </p>
                          <p className="date">
                            {edu.startDate && formatDate(edu.startDate)} -{" "}
                            {edu.endDate && formatDate(edu.endDate)}
                          </p>
                          {edu.description && (
                            <p className="education-description">
                              {edu.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-section">
                    {isOwnProfile
                      ? "Add your education"
                      : "No education listed"}
                  </p>
                )}
              </section>
            )}

            {activeTab === "skills" && (
              <section className="profile-section">
                <h2>Skills</h2>
                {displayProfile.skills && displayProfile.skills.length > 0 ? (
                  <div className="skills-list">
                    {displayProfile.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="empty-section">
                    {isOwnProfile ? "Add your skills" : "No skills listed"}
                  </p>
                )}
              </section>
            )}

            {activeTab === "posts" && (
              <section className="profile-section">
                <h2>Posts</h2>
                {posts.length > 0 ? (
                  <div className="posts-list">
                    {posts.map((post) => (
                      <PostCard key={post._id} post={post} />
                    ))}
                  </div>
                ) : (
                  <p className="empty-section">No posts yet</p>
                )}
              </section>
            )}
          </div>
        </div>

        <div className="profile-sidebar">
          <ProfileStats profile={displayProfile} />

          <div className="profile-sidebar-card">
            <h3>Contact Info</h3>
            <div className="contact-info">
              {displayProfile.email && (
                <div className="contact-item">
                  <Mail size={16} />
                  <span>{displayProfile.email}</span>
                </div>
              )}
              {displayProfile.phone && (
                <div className="contact-item">
                  <Phone size={16} />
                  <span>{displayProfile.phone}</span>
                </div>
              )}
              {displayProfile.website && (
                <div className="contact-item">
                  <Globe size={16} />
                  <a
                    href={displayProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {displayProfile.website}
                  </a>
                </div>
              )}
              <div className="contact-item">
                <LinkIcon size={16} />
                <span>
                  linkedin.com/in/
                  {displayProfile.name?.toLowerCase().replace(" ", "-")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfile
          profile={displayProfile}
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </div>
  );
};

export default Profile;
