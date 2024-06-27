import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import "./FrameOne.css"; // Importez le fichier CSS ici
import { iconsImgs } from "../../utils/images";
import { SidebarContext } from "../../context/sidebarContext";
import Pagination from '../Pagination/pagination';

const FrameOne = () => {
  const [frames, setFrames] = useState([]);
  const { toggleSidebar } = useContext(SidebarContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10); 

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = frames.slice(firstPostIndex, lastPostIndex);

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

  const deleteFrame = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/frame1/delete/${id}`);
      // If deletion is successful, update the frames state to reflect the changes
      setFrames(frames.filter(frame => frame.id !== id));
      console.log(`Frame with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting frame with ID ${id}:`, error);
    }
  };

  return (
    <div className='frame1'>
      <div className='title'>
        <button type="button" className="sidebar-button1" onClick={() => toggleSidebar()}>
          <img src={iconsImgs.sidebar} alt="" />
        </button>
        <div className='frameone-title'>Explore the CO2, HCHO, TVOC values</div>
      </div>
      <div className="container-1">
        <table className='table1'>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">CO2 (PPM)</th>
              <th scope="col">HCHO (g/m^3)</th>
              <th scope="col">TVOC (g/m^3)</th>
              <th scope="col">Date</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((frame, index) => (
              <tr key={frame.id}>
                <th scope='row'>{firstPostIndex + index + 1}</th>
                <td>{frame.co2}</td>
                <td>{frame.hcho}</td>
                <td>{frame.tvoc}</td>
                <td>{frame.date}</td>
                <td>
                  <img src={iconsImgs.trash} alt="" onClick={() => deleteFrame(frame.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          className="pagination"
          totalPosts={frames.length}
          postsPerPage={postsPerPage}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default FrameOne;
