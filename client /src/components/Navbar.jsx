import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { FiBell } from 'react-icons/fi'; // Import bell icon
import './Navbar.css';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  const handleLogout = async () => {
    try {
      if (!userId) return;

      await dispatch(logout(userId)).unwrap();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {user === null ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <span className="welcome-text">Welcome {userId}</span>
        )}
      </div>
      <div className="navbar-right">
        {user !== null && (
          <>
            <button className="notification-button">
              <FiBell size={20} />
            </button>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
