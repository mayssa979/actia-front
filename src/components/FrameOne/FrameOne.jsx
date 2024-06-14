import React, { useEffect, useState } from 'react';
import axios from "axios";
import "./FrameOne.css"; // Importez le fichier CSS ici
import { iconsImgs } from "../../utils/images";
import { useContext } from "react";
import { SidebarContext } from "../../context/sidebarContext";
const FrameOne = () => {
  const [frames, setFrames]= useState([])
  const { toggleSidebar } = useContext(SidebarContext);
  useEffect(() => {
    loadFrames();
  }, []);

  const loadFrames = async () => {
    try {
      const result = await axios.get("http://localhost:8080/frame1");
      setFrames(result.data);
      console.log(result.data);
    } catch (error) {
      console.error("Error fetching frames:", error);
    }
  };

  return (
    <div>
      <button type="button" className="sidebar-toggler" onClick={() => toggleSidebar() }>
          X
      </button>
      <h1>Explore the CO2, HCHO, TVOC values</h1>
      <div className="container">
        <table>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">CO2 (PPM)</th>
              <th scope="col">HCHO (g/m^3)</th>
              <th scope="col">TVOC (g/m^3)</th>
            </tr>
          </thead>
          <tbody>
            {frames.map((frame, index) => (
              <tr key={frame.id}>
                <th scope='row' key={index}>{index+1}</th>
                <td>{frame.co2}</td>
                <td>{frame.hcho}</td>
                <td>{frame.tvoc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FrameOne;
