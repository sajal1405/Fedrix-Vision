import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import BlogModal from "./BlogModal";

const BlogList = ({ posts, onEdit, onDelete }) => {
  const { user } = useContext(AuthContext);
  const isClient = user?.role === "client";
  const [previewPost, setPreviewPost] = useState(null);

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className="text-xl font-bold text-white mb-4">📰 Blog Posts</h3>

      {posts.length === 0 ? (
        <p className="text-white/50">No blog posts found.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 p-5 rounded-lg backdrop-blur-sm shadow-md"
            >
              <h4
                className="text-white font-semibold text-lg cursor-pointer hover:text-fedrix"
                onClick={() => setPreviewPost(post)}
              >
                {post.title}
              </h4>
              <p className="text-white/70 mt-2 line-clamp-3">
                {post.snippet || post.content?.slice(0, 100) + "..."}
              </p>

              {!isClient && (
                <div className="mt-4 flex gap-4">
                  <button
                    onClick={() => onEdit(post)}
                    className="px-4 py-2 bg-fedrix text-white text-sm rounded-md hover:bg-purple-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(post)}
                    className="px-4 py-2 bg-red-700 text-white text-sm rounded-md hover:bg-red-800"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Blog preview modal */}
      <BlogModal post={previewPost} onClose={() => setPreviewPost(null)} />
    </motion.div>
  );
};

export default BlogList;
