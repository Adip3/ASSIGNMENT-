import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import { X, Loader } from "lucide-react";
import "./Jobs.css";

const CreateJobModal = ({ onClose, onCreate }) => {
  const { user } = useAuth();
  const { showNotification } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: user?.company || "",
    location: "",
    type: "full-time",
    description: "",
    requirements: [""],
    salary: {
      min: "",
      max: "",
      currency: "USD",
    },
    experienceLevel: "mid",
    deadline: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.company ||
      !formData.location ||
      !formData.description
    ) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      const jobData = {
        ...formData,
        requirements: formData.requirements.filter((r) => r.trim()),
        salary:
          formData.salary.min && formData.salary.max ? formData.salary : null,
      };

      await onCreate(jobData);
      onClose();
    } catch (error) {
      showNotification("Failed to create job", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("salary.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        salary: { ...formData.salary, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRequirementChange = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ""] });
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal create-job-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Post a New Job</h2>
          <button className="modal-close" onClick={onClose} disabled={loading}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Senior Frontend Developer"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Company *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company name"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., San Francisco, CA or Remote"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Employment Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              <div className="form-group">
                <label>Experience Level</label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              <div className="form-group">
                <label>Application Deadline</label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Job Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                rows={6}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Requirements</label>
              {formData.requirements.map((req, index) => (
                <div key={index} className="requirement-input">
                  <input
                    type="text"
                    value={req}
                    onChange={(e) =>
                      handleRequirementChange(index, e.target.value)
                    }
                    placeholder="e.g., 5+ years of React experience"
                    disabled={loading}
                  />
                  {formData.requirements.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeRequirement(index)}
                      disabled={loading}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="btn-add-requirement"
                onClick={addRequirement}
                disabled={loading}
              >
                + Add Requirement
              </button>
            </div>

            <div className="form-group">
              <label>Salary Range (Optional)</label>
              <div className="salary-inputs">
                <input
                  type="number"
                  name="salary.min"
                  value={formData.salary.min}
                  onChange={handleChange}
                  placeholder="Min (in thousands)"
                  disabled={loading}
                />
                <span>to</span>
                <input
                  type="number"
                  name="salary.max"
                  value={formData.salary.max}
                  onChange={handleChange}
                  placeholder="Max (in thousands)"
                  disabled={loading}
                />
                <select
                  name="salary.currency"
                  value={formData.salary.currency}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="spinner" size={16} />
                  Posting...
                </>
              ) : (
                "Post Job"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal;
