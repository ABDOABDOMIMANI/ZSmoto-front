import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

interface LoginProps {
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const u = username.trim().toLowerCase();
    const p = password.trim().toLowerCase();
    if (u === "souhail" && p === "souhail") {
      setError("");
      localStorage.setItem("role", "admin");
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        localStorage.setItem("authenticated", "true");
        navigate("/dashboard", { replace: true });
      }
      return;
    }
    if (u === "abdo" && p === "abdo") {
      setError("");
      localStorage.setItem("role", "limited");
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        localStorage.setItem("authenticated", "true");
        navigate("/dashboard", { replace: true });
      }
      return;
    }
    setError("Invalid username or password. Please try again.");
  };

  return (
    <div className="login-container">
      <h2>Welcome Back!</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <div style={{ color: "red", marginBottom: "15px", textAlign: "center" }}>
            {error}
          </div>
        )}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
