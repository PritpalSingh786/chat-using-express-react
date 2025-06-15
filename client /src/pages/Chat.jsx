// Chat.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../features/auth/authSlice';
import ChatDetail from './ChatDetail';
import './Chat.css';

const Chat = () => {
  const dispatch = useDispatch();
  const {
    usersList,
    pagination,
    status,
    error,
    id: currentUserId,
    connectionId,
  } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const perPage = 10;

  useEffect(() => {
    dispatch(getAllUsers({ page: currentPage, perPage }));
  }, [dispatch, currentPage]);

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (pagination?.totalPages && currentPage < pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const noUsers = status === 'succeeded' && usersList?.length === 0;

  return (
    <div className="chat-layout">
      <div className="chat-sidebar">
        <h2 className="chat-title">Chat Users</h2>
        {status === 'loading' && <p className="loading-text">Loading users...</p>}
        {status === 'failed' && <p className="error-text">{error}</p>}
        {noUsers && <p className="no-users-text">No chat users found.</p>}

        {!noUsers && (
          <>
            <ul className="user-list">
              {usersList?.map((user) => (
                <li
                  key={user.userId}
                  className={`user-item ${selectedUser?.userId === user.userId ? 'active' : ''}`}
                  onClick={() => handleUserClick(user)}
                >
                  👤 {user.userId}
                </li>
              ))}
            </ul>

            <div className="pagination-controls">
              <button onClick={handlePrevious} disabled={currentPage === 1} className="pagination-button">
                Previous
              </button>
              <span className="pagination-info">
                Page {pagination?.page || currentPage} of {pagination?.totalPages || 1}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === pagination?.totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <div className="chat-main">
        {selectedUser ? (
          <ChatDetail
            userId={selectedUser.userId}
            uuid={selectedUser.uuid}
            receiverConnectionId={selectedUser.connectionId}
            currentUserId={currentUserId}
            connectionId={connectionId}
          />
        ) : (
          <p className="select-user-placeholder">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Chat;
