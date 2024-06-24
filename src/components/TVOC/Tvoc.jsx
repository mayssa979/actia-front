import { iconsImgs } from "../../utils/images";
import "./Tvoc.css";
import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";

const Tvoc = () => {
    const [lastFrame, setFrame]= useState([]);
    useEffect(() => {
      loadFrame();
    }, []);
  
    const loadFrame = async () => {
      try {
        const result = await axios.get("http://localhost:8080/frame1/latest");
        setFrame(result.data);
        console.log("latest frame" , result.data);
      } catch (error) {
        console.error("Error fetching frames:", error);
      }
    };
  return (
    <div className="grid-one-item grid-common grid-c3">
        <div className="grid-c-title">
            <h3 className="grid-c-title-text">TVOC</h3>
        </div>
        <div className="grid-c1-content">
            <div className="lg-value">{lastFrame.tvoc}</div>
        </div>
    </div>
  )
}

export default Tvoc
