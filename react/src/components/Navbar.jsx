// src/Navbar.js
import React, { useState } from 'react';
import '../Navbar.css';

const Navbar = () => {
  const [dropdown, setDropdown] = useState(false);

  const toggleDropdown = () => {
    setDropdown(!dropdown);
  };

  return (
    <div className="navbar">
      <a href="#" className="navbar-item"><i className="icon-home"></i> Home</a>
      <a href="#" className="navbar-item"><i className="icon-about"></i> About</a>
      <div className="navbar-item dropdown" onClick={toggleDropdown}>
        <i className="icon-services"></i> Services
        <i className="arrow-down"></i>
        {dropdown && (
          <div className="dropdown-menu">
            <a href="#" className="dropdown-item">Service 1</a>
            <a href="#" className="dropdown-item">Service 2</a>
            <a href="#" className="dropdown-item">Service 3</a>
          </div>
        )}
      </div>
      <a href="#" className="navbar-item"><i className="icon-contact"></i> Contact</a>
    </div>
  );
};

export default Navbar;
