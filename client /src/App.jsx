import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Sidebar from './pages/Sidebar';
import Chat from './pages/Chat';
import ChatDetail from './pages/ChatDetail';
import Posts from './pages/Posts';
import Navbar from './components/Navbar';

const App = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={user ? <Sidebar /> : <Navigate to="/login" />}
        >
          <Route path="chat" element={<Chat />} />
          <Route path="chat/:userId" element={<ChatDetail />} />
          <Route path="posts" element={<Posts />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
