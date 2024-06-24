import "./ContentMain.css";
import Co2 from "../CO2/Co2";
import Hcho from "../HCHO/Hcho";
import Tvoc from "../TVOC/tVOC";
import Temp from "../Temp/Temp";
import Humidity from "../Humidity/Humidity";

const ContentMain = () => {
  return (
    <div className="main-content-holder">
        <div className="content-grid-one">
            <div className="grid-item"><Co2 /></div>
            <div className="grid-item"><Hcho /></div>
            <div className="grid-item"><Tvoc /></div>
        </div>
        <div className="content-grid-two">
            <div className="grid-item"><Temp /></div>
            <div className="grid-item"><Humidity /></div>
        </div>
    </div>
  )
}

export default ContentMain
