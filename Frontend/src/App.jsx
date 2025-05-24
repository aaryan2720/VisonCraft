

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './Pages/HomePage-01/HomePage'
import ApplyNowPage from './Pages/ApplyNowPage/ApplyNowPage'
import SignupPage from './Pages/AuthenticationPages/SignupPage'
import LoginPage from './Pages/AuthenticationPages/LoginPage'
import CustomerDashboard from './Pages/Customer Dashboard/CustomerDashboard'
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path='/signup' element={<SignupPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path="/apply/:serviceId" element={<ApplyNowPage />} />
      <Route path="/dashboard" element={<CustomerDashboard />} />
    </Routes>
  )
}

export default App
