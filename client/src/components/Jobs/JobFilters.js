import React, { useState } from "react";
import { Search, MapPin, Briefcase, Award, Plus, Filter } from "lucide-react";
import "./Jobs.css";

const JobFilters = ({ filters, onFilterChange, canPostJobs, onCreateJob }) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const handleInputChange = (name, value) => {
    onFilterChange({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      search: "",
      location: "",
      type: "",
      experience: "",
    });
  };

  const activeFiltersCount = Object.values(filters).filter((v) => v).length;

  return (
    <div className="job-filters">
      <div className="filters-header">
        <h3>Job Filters</h3>
        {activeFiltersCount > 0 && (
          <button className="clear-filters" onClick={clearFilters}>
            Clear all ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="filter-group">
        <label>
          <Search size={16} />
          Search
        </label>
        <input
          type="text"
          placeholder="Job title, keywords, or company"
          value={filters.search}
          onChange={(e) => handleInputChange("search", e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>
          <MapPin size={16} />
          Location
        </label>
        <input
          type="text"
          placeholder="City, state, or remote"
          value={filters.location}
          onChange={(e) => handleInputChange("location", e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>
          <Briefcase size={16} />
          Job Type
        </label>
        <select
          value={filters.type}
          onChange={(e) => handleInputChange("type", e.target.value)}
        >
          <option value="">All Types</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
          <option value="internship">Internship</option>
          <option value="remote">Remote</option>
        </select>
      </div>

      <div className="filter-group">
        <label>
          <Award size={16} />
          Experience Level
        </label>
        <select
          value={filters.experience}
          onChange={(e) => handleInputChange("experience", e.target.value)}
        >
          <option value="">All Levels</option>
          <option value="entry">Entry Level</option>
          <option value="mid">Mid Level</option>
          <option value="senior">Senior Level</option>
          <option value="executive">Executive</option>
        </select>
      </div>

      <button
        className="btn-more-filters"
        onClick={() => setShowMoreFilters(!showMoreFilters)}
      >
        <Filter size={16} />
        {showMoreFilters ? "Less" : "More"} Filters
      </button>

      {showMoreFilters && (
        <div className="more-filters">
          <div className="filter-group">
            <label>Salary Range</label>
            <select>
              <option value="">Any</option>
              <option value="0-50">$0 - $50k</option>
              <option value="50-100">$50k - $100k</option>
              <option value="100-150">$100k - $150k</option>
              <option value="150+">$150k+</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date Posted</label>
            <select>
              <option value="">Any time</option>
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
          </div>
        </div>
      )}

      {canPostJobs && (
        <button
          className="btn btn-primary btn-full btn-post-job"
          onClick={onCreateJob}
        >
          <Plus size={20} />
          Post a Job
        </button>
      )}
    </div>
  );
};

export default JobFilters;
