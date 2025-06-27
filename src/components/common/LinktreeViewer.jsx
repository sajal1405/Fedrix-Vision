// File: D:/FedrixVision/src/components/common/LinktreeViewer.jsx
// This component provides a simple iframe to embed and view the live Linktree page.
// It's useful for administrators to quickly see how the edited Linktree looks on the public site.
import React from 'react';
import { motion } from 'framer-motion'; // For animations

const LinktreeViewer = () => {
  return (
    <motion.div
      className="p-6 bg-white/5 rounded-xl border border-white/10 shadow-lg min-h-[calc(100vh-180px)] flex flex-col"
      initial={{ opacity: 0, y: 10 }} // Initial animation state
      animate={{ opacity: 1, y: 0 }} // Animation to visible position
      transition={{ duration: 0.5 }} // Animation duration
    >
      <h2 className="text-white text-2xl font-bold mb-4">
        Live Linktree Preview
      </h2>
      <p className="text-white/70 text-sm mb-4">
        This is a live preview of your Linktree page hosted at
        `https://links.alnajahautorepairing.com`.
      </p>
      <div className="flex-grow">
        <iframe
          title="Linktree Preview"
          src="https://links.alnajahautorepairing.com" // URL of the live Linktree page
          // Styling for the iframe to ensure it's responsive and well-contained
          className="w-full h-[calc(100vh-350px)] rounded-lg border border-white/10"
          // Adding a sandbox attribute for security, allowing minimal necessary features.
          // Adjust this as needed based on the actual content of your Linktree.
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          // A loading message or spinner could be added here while the iframe loads.
        >
          Your browser does not support iframes. You can view the Linktree
          directly at{' '}
          <a
            href="https://links.alnajahautorepairing.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            links.alnajahautorepairing.com
          </a>
        </iframe>
      </div>
    </motion.div>
  );
};

export default LinktreeViewer;
