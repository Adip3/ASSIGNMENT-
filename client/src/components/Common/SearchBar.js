import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import "./Common.css";

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
      setShowSuggestions(false);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <div className="search-input-wrapper">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="search-input"
        />
      </div>

      {showSuggestions && query && (
        <div className="search-suggestions">
          <div className="suggestion-item">
            <Search size={16} />
            <span>Search for "{query}"</span>
          </div>
        </div>
      )}
    </form>
  );
};

export default SearchBar;
