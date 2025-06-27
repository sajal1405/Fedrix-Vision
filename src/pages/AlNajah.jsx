// src/pages/AlNajah.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext'; // Keeping for potential future use or context
import { useProfile } from '../context/UserProfileContext'; // Keeping for potential future use or context
import {
  FaSpinner,
  FaBookOpen,
  FaExternalLinkAlt,
  FaSyncAlt,
} from 'react-icons/fa';

// --- Mock Data for Development ---
const mockBlogData = [
  {
    id: 'blog1',
    title: 'The Future of Vehicle Maintenance: AI Integration',
    description:
      'Explore how artificial intelligence is revolutionizing car diagnostics and predictive maintenance, making your vehicle smarter and more reliable.',
    imageUrl:
      'https://via.placeholder.com/600x400/1C273C/87CEEB?text=AI+Maintenance',
    link: 'https://example.com/blog/ai-maintenance',
  },
  {
    id: 'blog2',
    title: 'Electric Vehicles: Charging Up for Success',
    description:
      "A comprehensive guide to EV charging technologies, infrastructure, and tips for optimizing your electric vehicle's battery life.",
    imageUrl:
      'https://via.placeholder.com/600x400/1C273C/90EE90?text=EV+Charging',
    link: 'https://example.com/blog/ev-charging',
  },
  {
    id: 'blog3',
    title: "Understanding Your Car's Dashboard Warning Lights",
    description:
      "Don't panic! This guide deciphers common dashboard warning lights and what they mean for your vehicle's health.",
    imageUrl:
      'https://via.placeholder.com/600x400/1C273C/FFA07A?text=Warning+Lights',
    link: 'https://example.com/blog/warning-lights',
  },
  {
    id: 'blog4',
    title: 'The Importance of Regular Oil Changes',
    description:
      "Why is an oil change so crucial for your engine's longevity and performance? We break down the science and benefits.",
    imageUrl:
      'https://via.placeholder.com/600x400/1C273C/FFD700?text=Oil+Change',
    link: 'https://example.com/blog/oil-changes',
  },
  {
    id: 'blog5',
    title: "Decoding Common Car Noises: What's That Sound?",
    description:
      'From squeaks to clunks, learn to identify unusual sounds coming from your car and when to seek professional help.',
    imageUrl:
      'https://via.placeholder.co/600x400/1C273C/ADD8E6?text=Car+Noises',
    link: 'https://example.com/blog/car-noises',
  },
];
// --- End Mock Data ---

const AlNajah = () => {
  // eslint-disable-next-line no-unused-vars
  const { profile, isLoadingProfile } = useProfile(); // These variables are part of the context, kept for potential use or role checking later.
  // eslint-disable-next-line no-unused-vars
  const { currentUser } = useAuth(); // Similar to profile, kept for potential use
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const JSON_DATA_URL = 'https://alnajahautorepairing.com/data/blogs.json';

  useEffect(() => {
    const fetchBlogData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(
          `Attempting to fetch Al Najah blog data from: ${JSON_DATA_URL}`,
        );
        const response = await fetch(JSON_DATA_URL);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(
            `Failed to fetch Al Najah blog data. Status: ${response.status}, Response: ${errorText}`,
          );
          throw new Error(
            `Failed to fetch Al Najah blog data: ${response.statusText || 'Network error'}`,
          );
        }
        const data = await response.json();
        setBlogs(data.blogs || []);
      } catch (err) {
        console.error('Error fetching Al Najah blog data:', err);
        setError(
          `Failed to load blog data: ${err.message}. Displaying mock data. Please check external API and certificate.`,
        );
        setBlogs(mockBlogData); // Fallback to mock data on error
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [JSON_DATA_URL]);

  return (
    <motion.div
      className="dashboard p-6 animate-fade-in flex flex-col h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-off-white mb-8">Al Najah Blogs</h1>

      <div className="mb-8">
        <p className="text-light-gray text-lg mb-4">
          Welcome to the Al Najah section, where you can find the latest
          articles, guides, and resources on vehicle maintenance, automotive
          technology, and industry insights.
        </p>
        <p className="text-light-gray text-lg">
          These resources are sourced directly from{' '}
          <a
            href="https://alnajahautorepairing.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:underline"
          >
            alnajahautorepairing.com{' '}
            <FaExternalLinkAlt className="inline-block ml-1 text-sm" />
          </a>
          .
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="animate-spin mr-2 text-xl text-teal-400" />
          <p className="text-light-gray text-lg animate-pulse">
            Loading blog posts...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 text-red-300 border border-red-500 p-4 rounded-lg mb-6 shadow-md">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-action mt-4 flex items-center justify-center gap-2 px-4 py-2 text-sm"
          >
            <FaSyncAlt /> Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {blogs.length > 0
          ? blogs.map((blog) => (
              <motion.div
                key={blog.id}
                className="hologram-tile p-6 flex flex-col items-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 * (blogs.indexOf(blog) % 3),
                }} // Staggered animation
                whileHover={{ scale: 1.03 }}
              >
                <img
                  src={
                    blog.imageUrl ||
                    'https://placehold.co/600x400/333333/CCCCCC?text=Blog+Image'
                  }
                  alt={blog.title}
                  className="w-full h-32 object-cover rounded-lg mb-4 border border-mid-gray"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'https://placehold.co/300x150/333333/F5F5F5?text=No+Image';
                  }}
                />
                <h3 className="text-xl font-bold mb-2 text-off-white">
                  {blog.title}
                </h3>
                <p className="text-light-gray text-sm mb-4 line-clamp-3">
                  {blog.description || 'No description available.'}
                </p>
                <div className="flex justify-between items-center w-full mt-auto pt-4 border-t border-mid-gray">
                  <span className="text-mid-gray text-xs">
                    {blog.date || 'N/A'}
                  </span>
                  {blog.link && (
                    <motion.a
                      href={blog.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center gap-2 text-sm px-3 py-1"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaBookOpen /> Read More
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))
          : !loading &&
            !error && (
              <p className="text-light-gray text-center col-span-full py-8">
                No blog posts found for Al Najah.
              </p>
            )}
      </div>
    </motion.div>
  );
};

export default AlNajah;
