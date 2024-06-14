import './App.css';
import Sidebar from './layout/Sidebar/Sidebar';
import Content from './layout/Content/Content';
import FrameOne from './components/FrameOne/FrameOne';
import FrameTwo from './components/FrameTwo/FrameTwo';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
      <div className='app'>
      <Router>
      <div className='app'>
        <Sidebar />
        <Routes>
          <Route path="/home" element={<Content />} />
          <Route path="/frameOne" element={<FrameOne />} />
          <Route path="/frameTwo" element={<FrameTwo />} />
        </Routes>
      </div>
     </Router>
      
      </div>
    </>
  )
}

export default App
