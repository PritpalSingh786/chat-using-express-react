// src/pages/Signup.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signup, resetStatus } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Reset status on mount
  useEffect(() => {
    dispatch(resetStatus());
  }, [dispatch]);

  // Redirect to login if signup is successful and no error
  useEffect(() => {
    if (status === 'succeeded' && !error) {
      dispatch(resetStatus()); // Reset after redirect to prevent loop
      navigate('/login');
    }
  }, [status, error, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signup({ userId, email, password }));
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" required />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Signup</button>
      {status === 'loading' && <p>Signing up...</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
};

export default Signup;
