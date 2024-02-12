import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, getCurrentUser } from '../../Redux/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const UserMenu = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const loading = useSelector(state => state.auth.loading);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  if (location.pathname !== '/contacts') {
    return null;
  }

  return (
    <div className="logaut">
      {loading ? (
        <div />
      ) : isAuthenticated ? (
        <>
          <div className="user-wrapper">
            <p className="txt">Welcome, {user?.name || 'User'}!</p>
            <button className="btn user-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      ) : (
        <p className="txt">User not logged in</p>
      )}
    </div>
  );
};

export default UserMenu;
