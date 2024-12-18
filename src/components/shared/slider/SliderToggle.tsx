import React from "react";
import "./SliderToggle.css"; // Include the CSS file for styling

const SliderToggle = ({ isUpload, onToggle }) => {
  return (
    <div className="slider-toggle">
      <button
        className={`slider-option ${isUpload ? "active" : ""}`}
        onClick={() => onToggle(true)}
      >
        Upload
      </button>
      <button
        className={`slider-option ${!isUpload ? "active" : ""}`}
        onClick={() => onToggle(false)}
      >
        Download
      </button>
      <div className={`slider-indicator ${isUpload ? "left" : "right"}`} />
    </div>
  );
};

export default SliderToggle;
