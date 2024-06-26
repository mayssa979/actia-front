import { iconsImgs } from "../../utils/images";
import "./ContentTop.css";
import { useContext } from "react";
import { SidebarContext } from "../../context/sidebarContext";

const ContentTop = () => {
  const { toggleSidebar, sidebarIcon } = useContext(SidebarContext);

  return (
    <div className="main-content-top">
      <div className="content-top-left">
        <button type="button" className="sidebar-button" onClick={toggleSidebar}>
          <img src={iconsImgs.sidebar} alt="" />
        </button>
        <div className="home-title">Home</div>
      </div>
    </div>
  );
};

export default ContentTop;