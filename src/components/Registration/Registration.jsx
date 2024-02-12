import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../Redux/authSlice';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleRegister = async e => {
    e.preventDefault();

    if (password.length < 7) {
      setPasswordError('Password must be at least 7 characters long');
      return;
    } else {
      setPasswordError('');
    }

    try {
      await dispatch(registerUser({ name, email, password }));
      setName('');
      setEmail('');
      setPassword('');
      setPasswordError('');
      setEmailError('');
      navigate('/contacts');
    } catch (error) {
      if (
        error.message ===
        'Email is already in use. Please use a different email.'
      ) {
        setEmailError(error.message);
      } else if (error.message === 'Unexpected error during registration.') {
        toast.error('Registration failed. Please try again.');
      } else {
        toast.error('Email is already in use. Please use a different email.');
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleRegister} className="wrapper">
        <h2 className="title">Register</h2>
        <label>
          Name:
          <input
            className="input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            className="input"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            error={!!emailError}
            helperText={emailError}
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
  {passwordError && <p className="error">{passwordError}</p>}
</label>
        <button
          className="btn"
          type="submit"
          variant="contained"
          color="primary"
        >
          Register
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
