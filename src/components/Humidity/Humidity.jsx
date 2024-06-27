import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { iconsImgs } from '../../utils/images';
import './Humidity.css';

const Humidity = () => {
  const [lastFrame, setLastFrame] = useState(null);

  useEffect(() => {
    const loadFrame = async () => {
      try {
        const result = await axios.get('http://localhost:8080/frame2/latest');
        setLastFrame(result.data);
        console.log('latest frame', result.data);
      } catch (error) {
        console.error('Error fetching frames:', error);
      }
    };
    loadFrame();

    // Establish WebSocket connection
    const socket = new WebSocket('ws://localhost:8080/websocket-frame2');

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);
        setLastFrame(newData); // Update with the latest data
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
    <div className="humidity-container">
      <div className="humidity-title">Humidity</div>
      <div className="humidity-value">{lastFrame.humidity}%</div>
      <img className="humidity-icon" src={iconsImgs.humidityIcon} alt="Humidity Icon" />
    </div>
  );
};

export default Humidity;
