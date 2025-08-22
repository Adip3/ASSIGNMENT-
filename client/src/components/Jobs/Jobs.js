import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jobService } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import JobCard from "./JobCard";
import JobFilters from "./JobFilters";
import CreateJobModal from "./CreateJobModal";
import LoadingSpinner from "../Common/LoadingSpinner";
import { Plus, Search } from "lucide-react";
import "./Jobs.css";

const Jobs = () => {
  const { user } = useAuth();
  const { showNotification } = useApp();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    type: "",
    experience: "",
  });
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadJobs();
  }, [filters]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getJobs(filters);
      setJobs(data || []);
    } catch (error) {
      console.error("Failed to load jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleJobCreate = async (jobData) => {
    try {
      await jobService.createJob(jobData);
      showNotification("Job posted successfully", "success");
      setShowCreateModal(false);
      loadJobs();
    } catch (error) {
      showNotification("Failed to create job", "error");
    }
  };

  const canPostJobs = user?.role === "job_poster" || user?.role === "admin";

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="jobs-page">
      <div className="jobs-container">
        <JobFilters
          filters={filters}
          onFilterChange={setFilters}
          canPostJobs={canPostJobs}
          onCreateJob={() => setShowCreateModal(true)}
        />

        <div className="jobs-main">
          <div className="jobs-header">
            <h2>Recommended for you</h2>
            <p>Based on your profile and search history</p>
          </div>

          <div className="jobs-list">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onClick={() => handleJobClick(job._id)}
                />
              ))
            ) : (
              <div className="no-jobs">
                <Search size={48} />
                <h3>No jobs found</h3>
                <p>Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateJobModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleJobCreate}
        />
      )}
    </div>
  );
};

export default Jobs;
