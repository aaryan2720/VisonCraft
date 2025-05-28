import React from 'react';
import { Link } from 'react-router-dom';
import './FooterLink.css';

const FooterLink = ({ text, path }) => {
  return (
    <li>
      <Link to={path}>{text}</Link>
    </li>
  );
};

export default FooterLink;