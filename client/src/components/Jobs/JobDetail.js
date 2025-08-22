// ========================================
// src/components/Jobs/JobDetail.js
// ========================================
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import LoadingSpinner from "../Common/LoadingSpinner";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
  Building,
  Globe,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatDate } from "../../utils/helpers";
import "./Jobs.css";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useApp();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationData, setApplicationData] = useState({
    resume: null,
    coverLetter: "",
  });
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    try {
      const data = await jobService.getJob(id);
      setJob(data);
      setIsSaved(data.savedBy?.includes(user._id));
      setHasApplied(data.applicants?.some((a) => a.user._id === user._id));
    } catch (error) {
      showNotification("Failed to load job details", "error");
      navigate("/jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!showApplicationForm) {
      setShowApplicationForm(true);
      return;
    }

    setApplying(true);
    try {
      await jobService.applyForJob(id, applicationData);
      setHasApplied(true);
      setShowApplicationForm(false);
      showNotification("Application submitted successfully!", "success");
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to apply",
        "error"
      );
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    try {
      await jobService.saveJob(id);
      setIsSaved(!isSaved);
      showNotification(
        isSaved ? "Job removed from saved" : "Job saved successfully",
        "success"
      );
    } catch (error) {
      showNotification("Failed to save job", "error");
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!job) {
    return null;
  }

  return (
    <div className="job-detail-page">
      <div className="job-detail-container">
        <button className="back-button" onClick={() => navigate("/jobs")}>
          <ArrowLeft size={20} />
          Back to Jobs
        </button>

        <div className="job-detail-card">
          <div className="job-detail-header">
            <div className="job-header-info">
              <div className="company-logo-large">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.company} />
                ) : (
                  <span>{job.company.charAt(0)}</span>
                )}
              </div>
              <div>
                <h1 className="job-detail-title">{job.title}</h1>
                <div className="job-detail-company">
                  <Building size={16} />
                  {job.company}
                </div>
                <div className="job-detail-meta">
                  <span>
                    <MapPin size={14} /> {job.location}
                  </span>
                  <span>
                    <Clock size={14} /> Posted {formatDate(job.createdAt)}
                  </span>
                  <span>
                    <Users size={14} /> {job.applicants?.length || 0} applicants
                  </span>
                </div>
              </div>
            </div>

            {user?.role === "job_seeker" && (
              <div className="job-detail-actions">
                <button
                  className={`btn btn-save ${isSaved ? "saved" : ""}`}
                  onClick={handleSave}
                >
                  {isSaved ? (
                    <BookmarkCheck size={20} />
                  ) : (
                    <Bookmark size={20} />
                  )}
                  {isSaved ? "Saved" : "Save"}
                </button>
                <button
                  className={`btn btn-primary ${hasApplied ? "applied" : ""}`}
                  onClick={handleApply}
                  disabled={hasApplied || applying}
                >
                  {hasApplied ? (
                    <>
                      <CheckCircle size={20} />
                      Applied
                    </>
                  ) : (
                    "Easy Apply"
                  )}
                </button>
              </div>
            )}
          </div>

          {showApplicationForm && !hasApplied && (
            <div className="application-form">
              <h3>Apply for this position</h3>
              <div className="form-group">
                <label>Resume/CV</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    setApplicationData({
                      ...applicationData,
                      resume: e.target.files[0],
                    })
                  }
                />
                <p className="form-hint">
                  Accepted formats: PDF, DOC, DOCX (Max 10MB)
                </p>
              </div>
              <div className="form-group">
                <label>Cover Letter (Optional)</label>
                <textarea
                  placeholder="Tell us why you're a great fit for this role..."
                  value={applicationData.coverLetter}
                  onChange={(e) =>
                    setApplicationData({
                      ...applicationData,
                      coverLetter: e.target.value,
                    })
                  }
                  rows={6}
                />
              </div>
              <div className="form-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowApplicationForm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleApply}
                  disabled={applying}
                >
                  {applying ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </div>
          )}

          <div className="job-detail-content">
            <section className="job-section">
              <h2>About the job</h2>
              <p className="job-full-description">{job.description}</p>
            </section>

            {job.requirements && job.requirements.length > 0 && (
              <section className="job-section">
                <h2>Requirements</h2>
                <ul className="requirements-list">
                  {job.requirements.map((req, index) => (
                    <li key={index}>
                      <CheckCircle size={16} />
                      {req}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.salary && (
              <section className="job-section">
                <h2>Compensation</h2>
                <div className="salary-range">
                  <DollarSign size={20} />
                  <span>
                    ${job.salary.min}k - ${job.salary.max}k{" "}
                    {job.salary.currency || "USD"} per year
                  </span>
                </div>
              </section>
            )}

            <section className="job-section">
              <h2>Job Details</h2>
              <div className="job-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Employment Type</span>
                  <span className="detail-value">
                    {job.type.replace("-", " ")}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Location</span>
                  <span className="detail-value">{job.location}</span>
                </div>
                {job.experienceLevel && (
                  <div className="detail-item">
                    <span className="detail-label">Experience Level</span>
                    <span className="detail-value">{job.experienceLevel}</span>
                  </div>
                )}
                {job.deadline && (
                  <div className="detail-item">
                    <span className="detail-label">Application Deadline</span>
                    <span className="detail-value">
                      {formatDate(job.deadline)}
                    </span>
                  </div>
                )}
              </div>
            </section>

            <section className="job-section">
              <h2>About the Company</h2>
              <div className="company-info">
                <div className="company-header">
                  <div className="company-logo-medium">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} />
                    ) : (
                      <span>{job.company.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3>{job.company}</h3>
                    {job.companySize && <p>{job.companySize} employees</p>}
                    {job.industry && <p>{job.industry}</p>}
                  </div>
                </div>
                {job.companyDescription && (
                  <p className="company-description">
                    {job.companyDescription}
                  </p>
                )}
              </div>
            </section>

            {job.postedBy && (
              <section className="job-section">
                <h2>Job Poster</h2>
                <div className="poster-info">
                  <div className="poster-avatar">
                    {job.postedBy.profilePicture ? (
                      <img
                        src={job.postedBy.profilePicture}
                        alt={job.postedBy.name}
                      />
                    ) : (
                      <span>{job.postedBy.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h4>{job.postedBy.name}</h4>
                    <p>
                      {job.postedBy.headline ||
                        `Hiring Manager at ${job.company}`}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>

        <div className="job-detail-sidebar">
          <div className="sidebar-card">
            <h3>Similar Jobs</h3>
            <p className="coming-soon">Coming soon...</p>
          </div>

          <div className="sidebar-card">
            <h3>Tips for Applying</h3>
            <ul className="tips-list">
              <li>
                <AlertCircle size={16} />
                Tailor your resume to match the job requirements
              </li>
              <li>
                <AlertCircle size={16} />
                Write a personalized cover letter
              </li>
              <li>
                <AlertCircle size={16} />
                Research the company culture and values
              </li>
              <li>
                <AlertCircle size={16} />
                Follow up after submitting your application
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
