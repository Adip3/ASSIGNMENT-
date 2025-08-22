import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { jobService } from "../../services/api";
import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { formatDate } from "../../utils/helpers";
import "./Jobs.css";

const JobCard = ({ job, onClick }) => {
  const { user } = useAuth();
  const { showNotification } = useApp();
  const [isSaved, setIsSaved] = React.useState(job.savedBy?.includes(user._id));
  const [hasApplied, setHasApplied] = React.useState(
    job.applicants?.some((a) => a.user === user._id)
  );

  const handleApply = async (e) => {
    e.stopPropagation();
    try {
      await jobService.applyForJob(job._id, {});
      setHasApplied(true);
      showNotification("Application submitted successfully", "success");
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Failed to apply",
        "error"
      );
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      await jobService.saveJob(job._id);
      setIsSaved(!isSaved);
      showNotification(
        isSaved ? "Job removed from saved" : "Job saved successfully",
        "success"
      );
    } catch (error) {
      showNotification("Failed to save job", "error");
    }
  };

  const getJobTypeColor = (type) => {
    const colors = {
      "full-time": "#0077b5",
      "part-time": "#057642",
      contract: "#b24020",
      internship: "#7a3eb1",
      remote: "#0073b1",
    };
    return colors[type] || "#666";
  };

  return (
    <div className="job-card" onClick={onClick}>
      <div className="job-card-header">
        <div className="company-logo">
          {job.companyLogo ? (
            <img src={job.companyLogo} alt={job.company} />
          ) : (
            <span>{job.company.charAt(0)}</span>
          )}
        </div>
        <button
          className="save-job-btn"
          onClick={handleSave}
          aria-label={isSaved ? "Unsave job" : "Save job"}
        >
          {isSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
        </button>
      </div>

      <div className="job-card-body">
        <h3 className="job-title">{job.title}</h3>
        <p className="job-company">{job.company}</p>

        <div className="job-meta">
          <span className="meta-item">
            <MapPin size={14} />
            {job.location}
          </span>
          {job.salary && (
            <span className="meta-item">
              <DollarSign size={14} />${job.salary.min}k - ${job.salary.max}k
            </span>
          )}
          <span className="meta-item">
            <Clock size={14} />
            {formatDate(job.createdAt)}
          </span>
        </div>

        <p className="job-description">
          {job.description.length > 150
            ? `${job.description.substring(0, 150)}...`
            : job.description}
        </p>

        <div className="job-card-footer">
          <span
            className="job-type"
            style={{
              backgroundColor: getJobTypeColor(job.type) + "20",
              color: getJobTypeColor(job.type),
            }}
          >
            {job.type.replace("-", " ")}
          </span>

          <div className="job-stats">
            <span className="applicants-count">
              <Users size={14} />
              {job.applicants?.length || 0} applicants
            </span>
          </div>
        </div>

        {user?.role === "job_seeker" && (
          <div className="job-actions">
            <button
              className={`btn btn-apply ${hasApplied ? "applied" : ""}`}
              onClick={handleApply}
              disabled={hasApplied}
            >
              {hasApplied ? "Applied" : "Easy Apply"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;
