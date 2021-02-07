import React from "react";
import "./protocolCard.scss";

const ProtocolCard = ({ title, value }) => {
  return (
    <div className="protocol-card">
      <p className="protocol-title">{title}</p>
      <p className="protocol-value">{value}</p>
    </div>
  );
};

export default ProtocolCard;
