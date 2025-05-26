import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage-01/HomePage';
import Footer from './Pages/HomePage-01/Footer/Footer';
import Faqs from './Pages/HomePage-01/Footer/FooterComponents/Faqs';
import HelpCenter from './Pages/HomePage-01/Footer/FooterComponents/HelpCenter';
import ServicePolicy from './Pages/HomePage-01/Footer/FooterComponents/ServicePolicy';
import PrivacyPolicy from './Pages/HomePage-01/Footer/FooterComponents/PrivacyPolicy';
// Import other components as needed

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Add other routes as needed */}
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/service-policy" element={<ServicePolicy />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;