import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

const BlogEditor = ({ selectedPost, onSave, onCancel }) => {
  const { user } = useContext(AuthContext);
  const isClient = user?.role === "client";

  const [title, setTitle] = useState("");
  const [snippet, setSnippet] = useState("");

  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title);
      setSnippet(selectedPost.snippet);
    } else {
      setTitle("");
      setSnippet("");
    }
  }, [selectedPost]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const post = { title, snippet };
    onSave(post);
    setTitle("");
    setSnippet("");
  };

  return (
    <motion.div
      className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-lg backdrop-blur-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-bold text-white mb-4">
        {selectedPost ? "✏️ Edit Blog Post" : "➕ New Blog Post"}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          required
          placeholder="Enter Title"
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 rounded-md bg-black border border-white/10 text-white outline-none"
          disabled={isClient}
        />

        <textarea
          rows={3}
          value={snippet}
          required
          placeholder="Short description..."
          onChange={(e) => setSnippet(e.target.value)}
          className="w-full p-3 rounded-md bg-black border border-white/10 text-white outline-none"
          disabled={isClient}
        ></textarea>

        {!isClient && (
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-md transition"
            >
              Save
            </button>
            {selectedPost && (
              <button
                type="button"
                onClick={onCancel}
                className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-md transition"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </form>
    </motion.div>
  );
};

BlogEditor.propTypes = {
  selectedPost: PropTypes.shape({
    title: PropTypes.string,
    snippet: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default BlogEditor;
