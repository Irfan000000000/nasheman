import React, { useEffect, useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const [isBacktickPressed, setIsBacktickPressed] = useState(false);

  const handleKeyDown = useCallback((event) => {
    if (event.key === '`') {
      setIsBacktickPressed(true);
    } else if (isBacktickPressed) {
      event.preventDefault();
      event.stopPropagation();
      switch (event.key.toLowerCase()) {
        case 'i':
          navigate('/invoice');
          break;
        case 'f':
          navigate('/item-form');
          break;
        case 'c':
          navigate('/category-form');
          break;
        case 's':
          navigate('/stock');
          break;
        case 'b':
          navigate('/barcode');
          break;
        case 'k':
          navigate('/scan-barcode');
          break;
        case 'e':
          navigate('/add-expense');
          break;
        case 'h':
          navigate('/expense-head');
          break;
        case 'a':
          navigate('/add-employee');
          break;
        case 't':
          navigate('/attendance');
          break;
        default:
          break;
      }
    }
  }, [isBacktickPressed, navigate]);

  const handleKeyUp = useCallback((event) => {
    if (event.key === '`') {
      setIsBacktickPressed(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <>
    
      <nav className="navbar navbar-expand-lg navbar-light bg-warning">
        <a className="navbar-brand   bold" href="#"><i className="fas fa-coins"></i> Point of Sale</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle   bold" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className='fas fa-shopping-cart'></i> Invoice
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link to="/invoice" className="dropdown-item">
                  <i className='fas fa-file-invoice'></i> Invoice Form
                </Link>
              </div>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle   bold" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className='fas fa-gift'></i> Item/Category
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link to="/item-form" className="dropdown-item">Item Form</Link>
                <Link to="/category-form" className="dropdown-item">Category Form</Link>
              </div>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle  bold" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className='fas fa-truck'></i> Stock
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link to="/stock" className="dropdown-item">Stock Form</Link>
              </div>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle   bold" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className='fas fa-barcode'></i> Barcode
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link to="/barcode" className="dropdown-item">Barcode</Link>
                <Link to="/scan-barcode" className="dropdown-item">Scan Barcode</Link>
              </div>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle   bold" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className='fas fa-receipt'></i> Expense/Expense Head
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link to="/add-expense" className="dropdown-item">Add Expense</Link>
                <Link to="/expense-head" className="dropdown-item">Expense Head</Link>
              </div>
            </li>

            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle   bold" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i className='fas fa-receipt'></i> Employee/Salary
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link to="/add-employee" className="dropdown-item">Add Employee</Link>
                <Link to="/salary" className="dropdown-item">Salary</Link>
                <Link to="/attendance" className="dropdown-item">Attendance</Link>
                <Link to="/register" className="dropdown-item">Register</Link>
              </div>
            </li>

            <li className="nav-item">
              <a className="nav-link   bold" href="#">Disabled</a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Header;
