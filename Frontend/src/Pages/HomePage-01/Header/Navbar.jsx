import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = () => {
  const [language, setLanguage] = useState('Marathi')
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLanguageChange = (lang) => {
    setLanguage(lang)
    setShowLanguageDropdown(false)
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    // Implement search functionality here
    console.log('Searching for:', searchQuery)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">DocNish</Link>
        </div>
        
        <div className="navbar-search">
          <form onSubmit={handleSearchSubmit}>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit" className="search-button">
              <span className="search-icon">🔍</span>
            </button>
          </form>
        </div>
        
        <div className="navbar-right">
          <div className="auth-buttons">
            <Link to="/login" className="login-button">Login</Link>
            <Link to="/signup" className="signup-button">Sign Up</Link>
          </div>
          
          <div className="language-selector">
            <span className="language-text">Language:</span>
            <button 
              className="language-button"
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            >
              {language} <span className="dropdown-arrow">▼</span>
            </button>
            
            {showLanguageDropdown && (
              <div className="language-dropdown">
                <div onClick={() => handleLanguageChange('English')}>English</div>
                <div onClick={() => handleLanguageChange('Hindi')}>Hindi</div>
                <div onClick={() => handleLanguageChange('Marathi')}>Marathi</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar