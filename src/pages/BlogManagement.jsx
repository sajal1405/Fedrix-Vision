import React, { useContext } from "react";
import { motion } from "framer-motion";
import { UserProfileContext } from "../context/UserProfileContext";
import BlogManager from "../components/blog/BlogManager.jsx";
import BlogList from "../components/blog/BlogList.jsx";

const BlogManagement = () => {
  const { profile } = useContext(UserProfileContext);
  const role = profile?.role || "guest";

  const renderContent = () => {
    if (role === "admin") {
      return (
        <div className="bg-white/5 p-6 border border-white/10 rounded-xl shadow-lg">
          <BlogManager />
        </div>
      );
    }

    if (role === "member") {
      return (
        <div className="bg-white/5 p-6 border border-white/10 rounded-xl shadow-lg">
          <BlogList posts={profile?.blogPreviews || []} />
        </div>
      );
    }

    return (
      <div className="p-6 text-red-400 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl font-semibold"
        >
          🚫 Access Restricted
        </motion.h2>
        <p className="text-white/60 mt-2">
          You don’t have permission to view this page.
        </p>
      </div>
    );
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-white text-2xl font-bold mb-4 flex items-center gap-2">
        📝 Blog Management
      </h2>

      {renderContent()}
    </motion.div>
  );
};

export default BlogManagement;
