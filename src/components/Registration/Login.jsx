import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../Redux/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async e => {
    e.preventDefault();

    try {
      await dispatch(loginUser({ email, password }));
      setEmail('');
      setPassword('');
      navigate('/contacts');
    } catch (error) {}
  };

  return (
    <div className="container">
      <form onSubmit={handleLogin} className="wrapper">
        <h2 className={'title'}>Login</h2>
        <label>
          {' '}
          Email:
          <input
            className="input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            className="input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <button
          className="btn"
          type="submit"
          variant="contained"
          color="primary"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
