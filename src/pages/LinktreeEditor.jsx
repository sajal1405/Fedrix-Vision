// src/pages/LinktreeEditor.jsx
import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/UserProfileContext';
import {
  FaLink,
  FaSyncAlt,
  FaPlus,
  FaTrash,
  FaCheck,
  FaTimes,
  FaFileAlt,
  FaEnvelope,
  FaSpinner, // Import FaSpinner
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data for Development ---
const mockLinktreeData = [
  {
    id: '1',
    title: 'Official Website',
    url: 'https://fedrixgroup.com',
    type: 'link',
  },
  {
    id: '2',
    title: 'LinkedIn Profile',
    url: 'https://linkedin.com/in/fedrixvision',
    type: 'social',
  },
  {
    id: '3',
    title: 'Twitter Feed',
    url: 'https://twitter.com/fedrixvision',
    type: 'social',
  },
  {
    id: '4',
    title: 'Latest Blog Post',
    url: 'https://fedrixgroup.com/blog/latest',
    type: 'blog',
  },
  {
    id: '5',
    title: 'Contact Us',
    url: 'mailto:info@fedrixgroup.com',
    type: 'email',
  },
];
// --- End Mock Data ---

const LinktreeEditor = () => {
  // eslint-disable-next-line no-unused-vars
  const { profile, isLoadingProfile } = useProfile();
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState({ title: '', url: '', type: 'link' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinktreeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          'https://alnajahautorepairing.com/data/linktree.json',
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLinks(data);
      } catch (err) {
        console.error('Error fetching Linktree data:', err);
        setError(
          'Failed to load Linktree data. Displaying mock data. Please check external API and certificate.',
        );
        setLinks(mockLinktreeData);
      } finally {
        setLoading(false);
      }
    };

    fetchLinktreeData();
  }, []);

  const handleAddLink = () => {
    if (newLink.title && newLink.url) {
      setLinks([...links, { ...newLink, id: Date.now().toString() }]);
      setNewLink({ title: '', url: '', type: 'link' });
    }
  };

  const handleUpdateLink = (id) => {
    setEditingId(id);
  };

  const handleSaveLink = (id, updatedLink) => {
    setLinks(links.map((link) => (link.id === id ? updatedLink : link)));
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDeleteLink = (id) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const getLinkIcon = (type) => {
    switch (type) {
      case 'social':
        return <FaLink className="text-purple-400" />;
      case 'blog':
        return <FaFileAlt className="text-orange-400" />;
      case 'email':
        return <FaEnvelope className="text-blue-400" />;
      default:
        return <FaLink className="text-teal-400" />;
    }
  };

  return (
    <div className="p-6 md:p-8 bg-black-ops min-h-screen">
      <h1 className="text-4xl font-bold text-off-white mb-8">
        Linktree Editor
      </h1>

      <div className="mb-8">
        <p className="text-light-gray text-lg">
          Manage your digital presence by creating a personalized linktree. Add,
          edit, or remove links to your websites, social media, and other
          important resources.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-48">
          <FaSpinner className="animate-spin mr-2 text-xl text-teal-400" />{' '}
          {/* FaSpinner used here */}
          <p className="text-light-gray text-lg animate-pulse">
            Loading links...
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-700/30 text-red-300 border border-red-500 p-4 rounded-lg mb-6 shadow-md">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Add New Link Section */}
      <motion.div
        className="glass-effect p-6 rounded-xl shadow-lg mb-8 border border-mid-gray"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-2xl font-bold text-off-white mb-4">Add New Link</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Link Title (e.g., My Website)"
            className="email-input"
            value={newLink.title}
            onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
          />
          <input
            type="url"
            placeholder="URL (e.g., https://example.com)"
            className="email-input"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
          />
          <select
            className="email-input"
            value={newLink.type}
            onChange={(e) => setNewLink({ ...newLink, type: e.target.value })}
          >
            <option value="link">General Link</option>
            <option value="social">Social Media</option>
            <option value="blog">Blog Post</option>
            <option value="email">Email</option>
          </select>
        </div>
        <button
          onClick={handleAddLink}
          className="btn-action mt-4 flex items-center justify-center"
        >
          <FaPlus className="mr-2" /> Add Link
        </button>
      </motion.div>

      {/* Link List Section */}
      <motion.div
        className="glass-effect p-6 rounded-xl shadow-lg border border-mid-gray"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-off-white mb-4">Your Links</h2>
        <AnimatePresence>
          {links.length === 0 && !loading && !error ? (
            <p className="text-light-gray text-center py-4">
              No links added yet.
            </p>
          ) : (
            <div className="space-y-4">
              {links.map((link) => (
                <motion.div
                  key={link.id}
                  className="hologram-tile p-4 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {editingId === link.id ? (
                    <>
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) =>
                          setLinks(
                            links.map((l) =>
                              l.id === link.id
                                ? { ...l, title: e.target.value }
                                : l,
                            ),
                          )
                        }
                        className="flex-grow w-full md:w-auto email-input mb-0"
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) =>
                          setLinks(
                            links.map((l) =>
                              l.id === link.id
                                ? { ...l, url: e.target.value }
                                : l,
                            ),
                          )
                        }
                        className="flex-grow w-full md:w-auto email-input mb-0"
                      />
                      <select
                        value={link.type}
                        onChange={(e) =>
                          setLinks(
                            links.map((l) =>
                              l.id === link.id
                                ? { ...l, type: e.target.value }
                                : l,
                            ),
                          )
                        }
                        className="w-full md:w-auto email-input mb-0"
                      >
                        <option value="link">General Link</option>
                        <option value="social">Social Media</option>
                        <option value="blog">Blog Post</option>
                        <option value="email">Email</option>
                      </select>
                      <div className="flex space-x-2 w-full md:w-auto justify-end">
                        <button
                          onClick={() => handleSaveLink(link.id, link)}
                          className="btn-primary bg-green-600 hover:bg-green-700 text-off-white"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn-primary bg-red-600 hover:bg-red-700 text-off-white"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center text-off-white text-lg flex-grow w-full md:w-auto">
                        {getLinkIcon(link.type)}
                        <span className="ml-3 font-semibold">{link.title}</span>
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-light-gray hover:text-teal-400 transition-colors duration-200 text-sm md:text-base truncate w-full md:w-auto"
                      >
                        {link.url.length > 50
                          ? `${link.url.substring(0, 47)}...`
                          : link.url}
                      </a>
                      <div className="flex space-x-2 w-full md:w-auto justify-end">
                        <button
                          onClick={() => handleUpdateLink(link.id)}
                          className="btn-primary bg-mid-gray hover:bg-dark-gray text-off-white"
                        >
                          <FaSyncAlt />
                        </button>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="btn-primary bg-red-600 hover:bg-red-700 text-off-white"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LinktreeEditor;
