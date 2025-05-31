import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BlogModal = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-black text-white max-w-3xl w-full p-6 rounded-xl border border-white/10 shadow-2xl relative overflow-y-auto max-h-[80vh]"
          initial={{ scale: 0.95, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 30 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <button
            className="absolute top-4 right-4 text-white/60 hover:text-white text-xl"
            onClick={onClose}
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold mb-4">{post.title}</h2>

          {post.image && (
            <img
              src={post.image}
              alt="cover"
              className="rounded-lg mb-4 w-full"
            />
          )}

          <ReactMarkdown
            children={post.content}
            remarkPlugins={[remarkGfm]}
            className="prose prose-invert max-w-none"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogModal;
