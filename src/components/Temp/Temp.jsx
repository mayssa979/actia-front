import "./Temp.css";
import React, { useEffect, useState } from 'react';
import axios from "axios";

const Temp = () => {
    const [lastFrame, setFrame] = useState({});
    
    useEffect(() => {
      loadFrame();
    }, []);
  
    const loadFrame = async () => {
      try {
        const result = await axios.get("http://localhost:8080/frame2/latest");
        setFrame(result.data);
        console.log("latest frame", result.data);
      } catch (error) {
        console.error("Error fetching frames:", error);
      }
    };

    return (
      <div className="grid-two-item grid-common grid-c4">
        <div className="grid-c-title">
          <h3 className="grid-c-title-text">Temperature</h3>
        </div>
        <div className="grid-c1-content">
          <div 
            className="lg-value" 
            style={{ color: lastFrame.temp > 50 ? 'red' : 'green' }}
          >
            {lastFrame.temp}
          </div>
        </div>
      </div>
    );
}

export default Temp;
