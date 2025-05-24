import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage-01/HomePage';
import Footer from './Pages/HomePage-01/Footer/Footer';
// Import other components as needed

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          < Route path="/" element={<HomePage />} />
          {/* Add other routes as needed */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;