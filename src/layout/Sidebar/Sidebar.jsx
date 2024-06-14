import { useEffect, useState } from 'react';
import { personsImgs } from '../../utils/images';
import { navigationLinks } from '../../data/data';
import "./Sidebar.css";
import { SidebarContext } from '../../context/sidebarContext';
import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [sidebarClass, setSidebarClass] = useState("");
  const { isSidebarOpen } = useContext(SidebarContext);
  const location = useLocation(); // Get the current location
  const activeLinkIdx = navigationLinks.findIndex(link => link.path === location.pathname) + 1; // Find index of active link based on path

  useEffect(() => {
    if (isSidebarOpen) {
      setSidebarClass('sidebar-change');
    } else {
      setSidebarClass('');
    }
  }, [isSidebarOpen, location.pathname]); // Add location.pathname to the dependency array

  return (
    <div className={`sidebar ${sidebarClass}`}>
      <div className="user-info">
        <div className="info-img img-fit-cover">
          <img src={personsImgs.person_two} alt="profile image" />
        </div>
        <span className="info-name">alice-doe</span>
      </div>

      <nav className="navigation">
        <ul className="nav-list">
          {navigationLinks.map((navigationLink) => (
            <li className="nav-item" key={navigationLink.id}>
              <Link 
                to={navigationLink.path} 
                className={`nav-link ${navigationLink.id === activeLinkIdx ? 'active' : ''}`}
              >
                <img 
                  src={navigationLink.image} 
                  className="nav-link-icon" 
                  alt={navigationLink.title} 
                />
                <span className="nav-link-text">{navigationLink.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
