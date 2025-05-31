import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => (
  <div className="flex flex-col justify-center items-center min-h-screen text-center text-white">
    <h1 className="text-4xl font-bold mb-4">403 - Unauthorized</h1>
    <p className="mb-6">You don’t have permission to access this page.</p>
    <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
  </div>
);

export default Unauthorized;
