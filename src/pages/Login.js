import React from "react";
import LoginForm from "../components/auth/LoginForm";
import AnimatedBackground from "../components/common/AnimatedBackground";

const Login = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <AnimatedBackground />
      <LoginForm />
    </div>
  );
};

export default Login;
