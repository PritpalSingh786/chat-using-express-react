import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, resetStatus } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import socket from "./socket";
import "./AuthForm.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [connectionId, setConnectionId] = useState("");

  useEffect(() => {
    dispatch(resetStatus());
  }, [dispatch]);

  useEffect(() => {
    if (socket.connected) {
      setConnectionId(socket.id);
    }
    const onConnect = () => setConnectionId(socket.id);
    socket.on("connect", onConnect);
    return () => socket.off("connect", onConnect);
  }, []);

  useEffect(() => {
    if (status === "succeeded") navigate("/");
  }, [status, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ userId, password, connectionId }));
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit" disabled={status === "loading"}>{status === "loading" ? "Logging in..." : "Login"}</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
};
export default Login;