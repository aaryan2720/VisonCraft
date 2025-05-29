
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage-01/HomePage'
import ApplyNowPage from './Pages/ApplyNowPage/ApplyNowPage'
import SignupPage from './Pages/AuthenticationPages/SignupPage'
import LoginPage from './Pages/AuthenticationPages/LoginPage'
import CustomerDashboard from './Pages/Customer Dashboard/CustomerDashboard'
import AdminCRM from './CRM Pages/AdminCrm'
import Faqs from './Pages/HomePage-01/Footer/FooterPages/Faqs/Faqs';
import HelpCenter from './Pages/HomePage-01/Footer/FooterPages/HelpCenter/HelpCenter';
import ServicePolicy from './Pages/HomePage-01/Footer/FooterPages/ServicePolicy/ServicePolicy';
import PrivacyPolicy from './Pages/HomePage-01/Footer/FooterPages/PrivacyPolicy/PrivacyPolicy';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path="/apply/:serviceId" element={<ApplyNowPage />} />
      <Route path="/dashboard" element={<CustomerDashboard />} />
      <Route path="/admin" element={<AdminCRM />} />
      <Route path="/faqs" element={<Faqs />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/service-policy" element={<ServicePolicy />} />
      
    </Routes>
  )
}

export default App
