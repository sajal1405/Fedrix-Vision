// src/components/blog/BlogList.js

import React from "react";

const BlogList = ({ posts, onEdit, onDelete }) => {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>📰 Blog Posts</h3>
      {posts.length === 0 ? (
        <p style={{ opacity: 0.6 }}>No blog posts yet.</p>
      ) : (
        <ul style={{ paddingLeft: "1rem" }}>
          {posts.map((post, i) => (
            <li key={i} style={{ marginBottom: "1rem" }}>
              <h4>{post.title}</h4>
              <p style={{ opacity: 0.7 }}>{post.snippet}</p>
              <div style={{ marginTop: "0.5rem" }}>
                <button onClick={() => onEdit(post)} style={btnStyle.edit}>Edit</button>
                <button onClick={() => onDelete(post)} style={btnStyle.delete}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const btnStyle = {
  edit: {
    marginRight: "1rem",
    padding: "0.4rem 0.8rem",
    backgroundColor: "#6f0c8a",
    color: "#fff",
    borderRadius: "4px",
  },
  delete: {
    padding: "0.4rem 0.8rem",
    backgroundColor: "#900",
    color: "#fff",
    borderRadius: "4px",
  },
};

export default BlogList;
