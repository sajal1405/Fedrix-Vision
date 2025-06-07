import React, { useState, useEffect } from "react";
import BlogList from "./BlogList.jsx";
import BlogEditor from "./BlogEditor.jsx";
import { supabase } from "../../supabaseClient";

const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchPosts();

    const channel = supabase
      .channel("posts-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        fetchPosts
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase.from("posts").select("*");
      if (error) throw error;
      if (data) setPosts(data);
      setErrorMsg("");
    } catch (err) {
      console.error("Fetch posts error", err);
      setErrorMsg(err.message || "Failed to fetch posts");
    }
  };

  const handleSave = async (post) => {
    try {
      if (selectedPost) {
        const { error } = await supabase.from("posts").update(post).eq("id", selectedPost.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").insert(post);
        if (error) throw error;
      }
      fetchPosts();
      setSelectedPost(null);
      setErrorMsg("");
    } catch (err) {
      console.error("Save post error", err);
      setErrorMsg(err.message || "Failed to save post");
    }
  };

  const handleEdit = (post) => setSelectedPost(post);
  const handleDelete = async (post) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);
      if (error) throw error;
      fetchPosts();
      setErrorMsg("");
    } catch (err) {
      console.error("Delete post error", err);
      setErrorMsg(err.message || "Failed to delete post");
    }
  };

  return (
    <div className="space-y-8">
      {errorMsg && (
        <div className="text-red-400 bg-white/5 border border-red-400/50 p-2 rounded-md">
          {errorMsg}
        </div>
      )}
      <BlogEditor
        selectedPost={selectedPost}
        onSave={handleSave}
        onCancel={() => setSelectedPost(null)}
      />
      <BlogList
        posts={posts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default BlogManager;
