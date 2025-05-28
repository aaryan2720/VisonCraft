import React from 'react'
import Services from './Components/Services/Services.jsx'
import CustomerTestomonial from "./Components/CustomerTestimonial/Components/CustomerTestimonial/CustomerTestimonial.jsx"

const MainSection = () => {
  return (
    <div className="main-section">
      <Services />
      <CustomerTestomonial />
    </div>
  )
}

export default MainSection