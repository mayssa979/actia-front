import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { iconsImgs } from "../../utils/images";
import { SidebarContext } from "../../context/sidebarContext";
import Pagination from '../Pagination/pagination';
import "./FrameTwo.css";

const FrameTwo = () => {
  const [frames, setFrames] = useState([]);
  const { toggleSidebar } = useContext(SidebarContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10); 

  useEffect(() => {
    loadFrames();
  }, []);

  const loadFrames = async () => {
    try {
      const result = await axios.get("http://localhost:8080/frame2");
      setFrames(result.data);
      console.log(result.data);
    } catch (error) {
      console.error("Error fetching frames:", error);
    }
  };

  const deleteFrame = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/frame2/delete/${id}`);
      setFrames(frames.filter(frame => frame.id !== id));
      console.log(`Frame with ID ${id} deleted successfully`);
    } catch (error) {
      console.error(`Error deleting frame with ID ${id}:`, error);
    }
  };

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = frames.slice(firstPostIndex, lastPostIndex);

  return (
    <div className='frame2'>
      <div className='title2'>
        <button type="button" className="sidebar-button" onClick={() => toggleSidebar()}>
          <img src={iconsImgs.sidebar} alt="" />
        </button>
        <div className='frametwo-title'>Explore the temperature and humidity values</div>
      </div>
      <div className="container2">
        <table className='table2'>
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Temperature (°F)</th>
              <th scope="col">Humidity</th>
              <th scope="col">Date</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.map((frame, index) => (
              <tr key={frame.id}>
                <th scope='row'>{firstPostIndex + index + 1}</th>
                <td>{frame.temp}</td>
                <td>{frame.humidity}</td>
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

export default FrameTwo;
