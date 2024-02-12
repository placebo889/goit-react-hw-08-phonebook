import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import UserMenu from './Registration/UserMenu';

const Navigation = () => {
  const location = useLocation();
  const showMenu = location.pathname !== '/contacts';

  return (
    <nav className="container">
      {showMenu && (
        <div className="navigation">
          <NavLink to="/" className="navigation-btn" activeClassName="active">
            Home
          </NavLink>
          <NavLink
            to="/register"
            className="navigation-btn"
            activeClassName="active"
          >
            Register
          </NavLink>
          <NavLink
            to="/login"
            className="navigation-btn"
            activeClassName="active"
          >
            Login
          </NavLink>
        </div>
      )}
      <UserMenu />
    </nav>
  );
};

export default Navigation;
