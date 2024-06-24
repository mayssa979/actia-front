import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { iconsImgs } from "../../utils/images"
import "./Humidity.css";

const Humidity = () => {
    const [lastFrame, setFrame]= useState([]);
    useEffect(() => {
      loadFrame();
    }, []);
  
    const loadFrame = async () => {
      try {
        const result = await axios.get("http://localhost:8080/frame2/latest");
        setFrame(result.data);
        console.log("latest frame" , result.data);
      } catch (error) {
        console.error("Error fetching frames:", error);
      }
    };
  return (
    <div className="subgrid-two-item grid-common grid-c5">
        <div className="grid-c-title">
            <h3 className="grid-c-title-text">Humidity</h3>
        </div>
        <div className="grid-c1-content">
            <div className="lg-value">{lastFrame.humidity}</div>
        </div>
    </div>
  )
}

export default Humidity
