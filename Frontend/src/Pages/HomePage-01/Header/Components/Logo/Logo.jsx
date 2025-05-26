import React from 'react';
import { Link } from 'react-router-dom';
import './Logo.css';

const Logo = () => {
  return (
    <div className="navbar-logo">
      <Link to="/">DocNish</Link>
    </div>
  );
};

export default Logo;