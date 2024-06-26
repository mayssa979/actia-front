import React from 'react';

const GaugeContainer = ({ children }) => {
  return (
    <div className="gauge-container-wrapper">
      <div className="gauge-container">
        {children}
      </div>
    </div>
  );
};

export default GaugeContainer;