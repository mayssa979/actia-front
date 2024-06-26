import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { iconsImgs } from '../../utils/images';
import './Hcho.css';

const Hcho = () => {
  const [lastFrame, setLastFrame] = useState(null);

  useEffect(() => {
    const loadFrame = async () => {
      try {
        const result = await axios.get('http://localhost:8080/frame1/latest');
        const adjustedData = {
          hcho: result.data.hcho * 0.001,
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
    <div className="hcho-container">
      <div className="hcho-title">HCHO</div>
      <div className="hcho-value">{lastFrame.hcho.toFixed(2)}</div>
      <span className="hcho-unit">mg/m³</span>
    </div>
  );
};

export default Hcho;