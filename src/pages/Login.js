import React from "react";
import LoginForm from "../components/auth/LoginForm.jsx";
import AnimatedBackground from "../components/common/AnimatedBackground.jsx";

const Login = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <AnimatedBackground />
      <LoginForm />
    </div>
  );
};

export default Login;
