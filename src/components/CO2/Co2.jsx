import React, { useEffect, useState } from 'react';
import axios from "axios";
import "./Co2.css";

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
        // Assuming the value ranges from 0 to 1400, and the gauge is a half-circle (180 degrees)
        const maxRotation = 180;
        const maxValue = 1400;
        return (value / maxValue) * maxRotation - 90; // Subtract 90 to start from the left side
    };

    return (
        <div className="gauge-container">
            <div className="gauge-title">
                <h3 className="gauge-title-text">CO2</h3>
            </div>
            <div className="gauge-content">
                <div className="gauge">
                    <div className="gauge-background">
                        <div className="gauge-needle" style={{ transform: `rotate(${calculateRotation(lastFrame.co2)}deg)` }}></div>
                        <div className="gauge-center"></div>
                    </div>
                    <div className="gauge-graduations">
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className="gauge-tick" style={{ transform: `rotate(${i * 12 - 90}deg)` }}>
                                <div className="gauge-tick-mark"></div>
                            </div>
                        ))}
                    </div>
                    <div className="gauge-value">{lastFrame.co2} ppm</div>
                </div>
            </div>
        </div>
    );
}

export default Co2;
