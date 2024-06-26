import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { iconsImgs } from '../../utils/images';
import './Tvoc.css';

const Tvoc = () => {
  const [lastFrame, setLastFrame] = useState(null);

  useEffect(() => {
    const loadFrame = async () => {
      try {
        const result = await axios.get('http://localhost:8080/frame1/latest');
        const adjustedData = {
          ...result.data,
          tvoc: result.data.tvoc * 0.001,
        };
        setLastFrame(adjustedData);
        console.log('latest frame', adjustedData);
      } catch (error) {
        console.error('Error fetching frames:', error);
      }
    };
    loadFrame();
  }, []);

  if (!lastFrame) {
    return null;
  }

  return (
    <div className="tvoc-container">
      <div className="tvoc-title">TVOC</div>
      <div className="tvoc-value">{lastFrame.tvoc.toFixed(2)}</div>
      <span className="tvoc-unit">mg/m³</span>
    </div>
  );
};

export default Tvoc;