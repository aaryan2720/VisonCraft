import React from 'react';
import { Link } from 'react-router-dom';
import './SignUpLink.css';

const SignUpLink = () => {
  return (
    <div className="signup-link">
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
};

export default SignUpLink;