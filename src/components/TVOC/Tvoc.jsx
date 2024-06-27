import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Tvoc.css';

const Tvoc = () => {
  const [lastFrame, setLastFrame] = useState(null);

  useEffect(() => {
    // Load the initial frame
    const loadFrame = async () => {
      try {
        const result = await axios.get('http://localhost:8080/frame1/latest');
        const adjustedData = {
          ...result.data,
          tvoc: (result.data.tvoc * 0.001).toFixed(3),
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
          ...newData,
          tvoc: (newData.tvoc * 0.001).toFixed(3),
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
    <div className="tvoc-container">
      <div className="tvoc-title">TVOC</div>
      <div className="tvoc-value">{lastFrame.tvoc}</div>
      <span className="tvoc-unit">mg/m³</span>
    </div>
  );
};

export default Tvoc;
