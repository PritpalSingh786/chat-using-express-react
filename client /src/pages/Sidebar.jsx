// src/pages/Sidebar.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Sidebar.css'; // Optional for custom styling

const Sidebar = () => {
  return (
    <div className="sidebar-layout">
      <div className="sidebar">
        <h2>My App</h2>
        <nav>
          <ul>
            <li><Link to="chat">Chat</Link></li>
            <li><Link to="posts">Posts</Link></li>
          </ul>
        </nav>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
