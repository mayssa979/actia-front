import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Hcho.css';

const Hcho = () => {
  const [lastFrame, setLastFrame] = useState(null);

  useEffect(() => {
    // Load the initial frame
    const loadFrame = async () => {
      try {
        const result = await axios.get('http://localhost:8080/frame1/latest');
        const adjustedData = {
          hcho: (result.data.hcho * 0.001).toFixed(3), // Ensure value has 3 decimal places
        };
        setLastFrame(adjustedData);
        console.log('latest frame', adjustedData);
      } catch (error) {
        console.error('Error fetching frames:', error);
      }
    };
    loadFrame();

    // Establish WebSocket connection
    const socket = new WebSocket('ws://localhost:8080/websocket-frame1');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        const adjustedData = {
          hcho: (newData.hcho * 0.001).toFixed(3), // Ensure value has 3 decimal places
        };
        setLastFrame(adjustedData); // Update with the latest data
      } catch (error) {
        console.error('Error parsing message data:', error);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  if (!lastFrame) {
    return null;
  }

  return (
    <div className="hcho-container">
      <div className="hcho-title">HCHO</div>
      <div className="hcho-value">{lastFrame.hcho}</div>
      <span className="hcho-unit">mg/m³</span>
    </div>
  );
};

export default Hcho;
