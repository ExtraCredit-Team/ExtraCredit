import React from "react";
import "./rangeInput.scss";

const rangeInput = ({ value, onChange, name }) => {
  return (
    <div>
      <input className="input-range" type="range" onChange={onChange} value={value} name={name} min={0} />
    </div>
  );
};

export default rangeInput;
