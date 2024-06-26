import "./Temp.css";
import React, { useEffect, useState } from 'react';
import axios from "axios";

const Temp = () => {
    const [lastFrame, setFrame] = useState({ temp: 0 });

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

    const calculateHeight = (temp) => {
        // Convert temperature to a percentage position between -20 and 70
        const minTemp = -20;
        const maxTemp = 70;
        const percentage = ((temp - minTemp) / (maxTemp - minTemp)) * 100;
        return `${percentage}%`;
    };

    return (
      <div className="temp">
         <div className="temp-title">
                <h3>Temperature</h3>
            </div>
        <div className="temp-container">
           
            <div className="temp-ruler">
                {[...Array(10)].map((_, index) => (
                    <div key={index} className="temp-mark" data-value={-20 + index * 10}></div>
                ))}
                <div
                    className={`temp-line ${lastFrame.temp >= 50 ? 'high' : ''}`}
                    style={{ height: calculateHeight(lastFrame.temp) }}
                ></div>
            </div>
            <div className="temp-value">
                {lastFrame.temp}°C
            </div>
        </div>
        </div>
    );
}

export default Temp;
