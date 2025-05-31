import React, { useState, useEffect } from "react";
import BlogList from "./BlogList";
import BlogEditor from "./BlogEditor";
import { supabase } from "../../supabaseClient";

const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase.from("posts").select("*");
    if (data) setPosts(data);
  };

  const handleSave = async (post) => {
    if (selectedPost) {
      await supabase
        .from("posts")
        .update(post)
        .eq("id", selectedPost.id);
    } else {
      await supabase.from("posts").insert(post);
    }
    fetchPosts();
    setSelectedPost(null);
  };

  const handleEdit = (post) => setSelectedPost(post);

  const handleDelete = async (post) => {
    await supabase.from("posts").delete().eq("id", post.id);
    fetchPosts();
  };

  return (
    <div>
      <BlogEditor selectedPost={selectedPost} onSave={handleSave} onCancel={() => setSelectedPost(null)} />
      <BlogList posts={posts} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default BlogManager;
