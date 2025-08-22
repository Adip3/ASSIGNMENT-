import React from "react";
import "./Common.css";

const LoadingSpinner = ({ fullScreen = false, size = "medium" }) => {
  return (
    <div
      className={`loading-spinner ${fullScreen ? "fullscreen" : ""} ${size}`}
    >
      <div className="spinner">
        <div className="spinner-circle"></div>
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
