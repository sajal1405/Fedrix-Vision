import React, { useState, useEffect } from "react";
import BlogList from "./BlogList.jsx";
import BlogEditor from "./BlogEditor.jsx";
import { supabase } from "../../supabaseClient";

const BlogManager = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

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
    const { data } = await supabase.from("posts").select("*");
    if (data) setPosts(data);
  };

  const handleSave = async (post) => {
    if (selectedPost) {
      await supabase.from("posts").update(post).eq("id", selectedPost.id);
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
    <div className="space-y-8">
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
