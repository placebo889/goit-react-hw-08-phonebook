import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Phonebook from './PhoneBook/Phonebook';
import Register from './Registration/Registration';
import Login from './Registration/Login';
import Navigation from './Navigation';
import Home from './PhoneBook/Refactor/home';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element, redirectTo }) => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return isAuthenticated ? (
    <>{element}</>
  ) : (
    <Navigate to={redirectTo} replace />
  );
};

export const App = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  return (
    <div>
      <Navigation />
      <div>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/contacts" /> : <Home />}
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/contacts" /> : <Register />
            }
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/contacts" /> : <Login />}
          />
          <Route
            path="/contacts"
            element={
              <PrivateRoute element={<Phonebook />} redirectTo="/login" />
            }
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? '/contacts' : '/'} />}
          />
        </Routes>
      </div>
    </div>
  );
};
