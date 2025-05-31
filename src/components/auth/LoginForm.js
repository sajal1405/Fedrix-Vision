import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setMessage("Login error: " + error.message);
    } else {
      setMessage("Check your email for the login link.");
    }
  };

  return (
    <div className="login-container fade-in">
      <h2>Sign in to Fedrix Vision</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="email-input"
        />
        <button
          type="submit"
          style={{
            backgroundColor: "#6f0c8a",
            color: "#fff",
            padding: "0.7rem 1.5rem",
            borderRadius: "8px",
            marginTop: "1rem",
          }}
        >
          Send Magic Link
        </button>
      </form>
      {message && <p style={{ marginTop: "1rem", opacity: 0.7 }}>{message}</p>}
    </div>
  );
};

export default LoginForm;
