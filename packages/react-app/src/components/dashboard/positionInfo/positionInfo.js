import React from "react";
import "./positionInfo.css";

const positionInfo = ({ label, value }) => {
  return (
    <div className="postion-info">
      <p className="postion-info-label">{label}</p>
      <p className="postion-info-value">{value}</p>
    </div>
  );
};

export default positionInfo;
