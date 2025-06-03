
import { Route, Routes } from 'react-router-dom'
import Admin from "./Pages/Admin Pages/Admin"
import ApplyNowPage from './Pages/ApplyNowPage/ApplyNowPage'
import LoginPage from './Pages/AuthenticationPages/Login Pages/LoginPage'
import SignupPage from './Pages/AuthenticationPages/SignUp Pages/SignupPage'
import AdminCRM from './Pages/CRM Pages/AdminCrm'
import CustomerDashboard from './Pages/Customer Dashboard/CustomerDashboard'
import Faqs from './Pages/HomePage-01/Footer/FooterPages/Faqs/Faqs'
import HelpCenter from './Pages/HomePage-01/Footer/FooterPages/HelpCenter/HelpCenter'
import PrivacyPolicy from './Pages/HomePage-01/Footer/FooterPages/PrivacyPolicy/PrivacyPolicy'
import ServicePolicy from './Pages/HomePage-01/Footer/FooterPages/ServicePolicy/ServicePolicy'
import HomePage from './Pages/HomePage-01/HomePage'
import AboutUs from './Pages/HomePage-01/Footer/FooterComponents/About'
import Blogs from './Pages/HomePage-01/Footer/FooterComponents/Blogs'
import Career from './Pages/HomePage-01/Footer/FooterComponents/Career'
import Contact from './Pages/HomePage-01/Footer/FooterComponents/Contact'
import Downloads from './Pages/HomePage-01/Footer/FooterComponents/Downloads'
import Partner from './Pages/HomePage-01/Footer/FooterComponents/Partner'
import TermsAndConditions from './Pages/HomePage-01/Footer/FooterComponents/Terms'
import ProtectedRoute from './components/ProtectedRoute'


function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path="/apply/:serviceId" element={<ApplyNowPage />} />
      <Route path="/dashboard" element={<CustomerDashboard />} />
      <Route path="/crm" element={
        <ProtectedRoute allowedEmail="crmdocnish24@visioncraft.com">
          <AdminCRM />
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute allowedEmail="admindocnish24@visioncraft.com">
          <Admin />
        </ProtectedRoute>
      } />
      <Route path="/faqs" element={<Faqs />} />
      <Route path="/help-center" element={<HelpCenter />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/service-policy" element={<ServicePolicy />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/blog" element={<Blogs />} />
      <Route path="/careers" element={<Career />} />
      <Route path="/contact-us" element={<Contact />} />
      <Route path="/download-app" element={<Downloads />} />
      <Route path="/partner" element={<Partner />} />
      <Route path="/terms-conditions" element={<TermsAndConditions />} />
      
      
    </Routes>
  )
}

export default App
