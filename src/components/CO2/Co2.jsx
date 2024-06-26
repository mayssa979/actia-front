import React, { useEffect, useState } from 'react';
import axios from "axios";
import "./Co2.css";
import GaugeContainer from './GaugeContainer';

const Co2 = () => {
  const [lastFrame, setFrame] = useState({ co2: 0 });

  useEffect(() => {
    loadFrame();
  }, []);

  const loadFrame = async () => {
    try {
      const result = await axios.get("http://localhost:8080/frame1/latest");
      setFrame(result.data);
      console.log("latest frame", result.data);
    } catch (error) {
      console.error("Error fetching frames:", error);
    }
  };

  const calculateRotation = (value) => {
    const maxRotation = 180;
    const maxValue = 1400;
    return (value / maxValue) * maxRotation - 90;
  };

  return (
    <div className='co2-container'>
    <GaugeContainer>
      <div className="gauge-title">
        CO2
      </div>
      <div className="gauge-content">
        <div className="gauge">
          <div className="gauge-background"></div>
          <div className="gauge-needle" style={{ transform: `rotate(${calculateRotation(lastFrame.co2)}deg)` }}></div>
        </div>
      </div>
      <div className="gauge-value">{lastFrame.co2} ppm</div>
    </GaugeContainer>
    </div>
  );
};

export default Co2;