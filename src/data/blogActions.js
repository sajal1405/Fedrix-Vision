// src/data/blogActions.js
// This file previously defined in-memory operations for blog data.
// With Supabase integration, these functions are now primarily illustrative
// or could serve as utility functions for data manipulation *after* fetching
// from Supabase, or *before* sending to Supabase.
// For direct database interaction, use the supabaseClient directly in components
// like BlogManager.jsx and AlNajah.jsx.

// This array now acts as a local cache or a starting point for data.
let blogData = [];

/**
 * Initializes or updates the in-memory blog data.
 * This can be used to load data fetched from a database into a local cache.
 * @param {Array<Object>} initialData - An array of blog post objects.
 */
export const setBlogData = (initialData) => {
  if (Array.isArray(initialData)) {
    blogData = [...initialData]; // Create a shallow copy to prevent external mutation
    // console.log("Blog data initialized/updated. Total posts:", blogData.length);
  } else {
    console.warn('setBlogData received non-array data:', initialData);
    blogData = []; // Reset if invalid data is provided
  }
};

/**
 * Retrieves all current blog posts from the in-memory store.
 * @returns {Array<Object>} A shallow copy of the blog post objects.
 */
export const getBlogs = () => {
  return [...blogData]; // Return a copy to ensure immutability outside this module
};

/**
 * Adds a new blog post to the in-memory store.
 * In a real application, the actual addition would typically happen via an API call
 * to a backend (like Supabase, as seen in BlogManager). This function then updates
 * the local cache.
 * @param {Object} newPost - The new blog post object. Must have at least `title`, `content`.
 * @returns {Array<Object>} The updated list of blog posts in memory.
 */
export const addBlog = (newPost) => {
  if (
    !newPost ||
    typeof newPost !== 'object' ||
    !newPost.title ||
    !newPost.content
  ) {
    console.error('Invalid new post data provided to addBlog:', newPost);
    return [...blogData];
  }

  const postToAdd = {
    id: newPost.id || Date.now().toString(), // Ensure unique ID
    date: newPost.date || new Date().toISOString().split('T')[0], // Default to current date
    author: newPost.author || 'Guest', // Default author
    ...newPost,
  };
  blogData.unshift(postToAdd); // Add to the beginning of the array (newest first)
  // console.log("In-memory blog added:", postToAdd.title);
  return [...blogData];
};

/**
 * Updates an existing blog post in the in-memory store by its ID.
 * Similar to `addBlog`, the primary update typically happens on the backend,
 * and this function updates the local representation.
 * @param {string} id - The unique ID of the post to update.
 * @param {Object} updatedFields - An object containing the fields to update in the post.
 * @returns {Array<Object>} The updated list of blog posts in memory.
 */
export const updateBlog = (id, updatedFields) => {
  const index = blogData.findIndex((post) => post.id === id);
  if (index !== -1) {
    blogData[index] = { ...blogData[index], ...updatedFields }; // Merge existing with updated fields
    // console.log("In-memory blog updated:", blogData[index].title);
  } else {
    console.warn(`Blog with ID ${id} not found in memory for update.`);
  }
  return [...blogData];
};

/**
 * Deletes a blog post from the in-memory store by its ID.
 * The actual deletion from the database would occur via an API call.
 * @param {string} id - The unique ID of the post to delete.
 * @returns {Array<Object>} The updated list of blog posts in memory.
 */
export const deleteBlog = (id) => {
  const initialLength = blogData.length;
  blogData = blogData.filter((post) => post.id !== id); // Filter out the deleted post
  if (blogData.length < initialLength) {
    // console.log("In-memory blog deleted with ID:", id);
  } else {
    console.warn(`Blog with ID ${id} not found in memory for deletion.`);
  }
  return [...blogData];
};
