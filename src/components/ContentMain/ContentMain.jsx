import "./ContentMain.css";
import Co2 from "../CO2/Co2";
import Hcho from "../HCHO/Hcho";
import Tvoc from "../TVOC/tVOC";
import Temp from "../Temp/Temp";
import Humidity from "../Humidity/Humidity";
import Dashboard from "../dashboard/Dashboard";

const ContentMain = () => {
  return (
    <div className="main-content-holder">
      <div className="content-grid-one">
        <div className="grid-item grid-item-temp"><Temp /></div>
        <div className="grid-item grid-item-hcho"><Hcho /></div>
        <div className="grid-item grid-item-tvoc"><Tvoc /></div>
        <div className="grid-item grid-item-co2"><Co2 /></div>
        <div className="grid-item grid-item-humidity"><Humidity /></div>
      </div>
    </div>
  )
}

export default ContentMain;
