import { useState } from "react";

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const enteredEmail = email.trim().toLowerCase();
    const enteredPassword = password.trim();

    if (!enteredEmail || !enteredPassword) {
      alert("Please enter email and password");
      return;
    }

    if (
      enteredEmail === "admin@shopnest.com" &&
      enteredPassword === "admin123"
    ) {
      alert("Admin Login Successful! 🎉");
      onLogin();
    } else {
      alert("Invalid Admin Email or Password ❌");
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-box">
        <h1>🛍️ ShopNest</h1>
        <h2>👨‍💼 Admin Login</h2>

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login as Admin
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;