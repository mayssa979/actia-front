import './App.css';
import Sidebar from './layout/Sidebar/Sidebar';
import Content from './layout/Content/Content';
import FrameOne from './components/FrameOne/FrameOne';
import FrameTwo from './components/FrameTwo/FrameTwo';
import Statistics from './components/Statistics/Statistics';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <div className='app'>
      <Router>
      <div className='app'>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Content />} />
          <Route path="/frameOne" element={<FrameOne />} />
          <Route path="/frameTwo" element={<FrameTwo />} />
          <Route path="/statistic" element={<Statistics />} />
        </Routes>
      </div>
     </Router>
      
      </div>
    </>
  )
}

export default App
