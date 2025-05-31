import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const BlogEditor = ({ selectedPost, onSave, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (selectedPost) {
      setTitle(selectedPost.title || "");
      setContent(selectedPost.content || "");
      setPreviewImage(selectedPost.image || "");
    } else {
      setTitle("");
      setContent("");
      setPreviewImage("");
    }
  }, [selectedPost]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const { data, error } = await supabase.storage
      .from("blog-images")
      .upload(`public/${Date.now()}-${file.name}`, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Image upload error:", error.message);
    } else {
      const url = supabase.storage
        .from("blog-images")
        .getPublicUrl(data.path).data.publicUrl;
      setPreviewImage(url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const post = {
      title,
      content,
      image: previewImage,
    };
    onSave(post);
    setTitle("");
    setContent("");
    setPreviewImage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Blog Title"
        className="email-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        placeholder="Write in Markdown..."
        className="email-input"
        rows="8"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />

      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="text-white text-sm"
        />
        {previewImage && (
          <img src={previewImage} alt="Preview" className="mt-3 w-full rounded-lg" />
        )}
      </div>

      <button type="submit" className="btn-primary">
        {selectedPost ? "Update Post" : "Create Post"}
      </button>
      {selectedPost && (
        <button type="button" onClick={onCancel} className="ml-4 text-sm text-white/70 underline">
          Cancel
        </button>
      )}

      {/* Live Markdown Preview */}
      <div className="mt-8 bg-white/5 border border-white/10 p-4 rounded-lg">
        <h4 className="text-white font-semibold mb-2">Live Preview</h4>
        <ReactMarkdown
          children={content}
          remarkPlugins={[remarkGfm]}
          className="prose prose-invert max-w-none"
        />
      </div>
    </form>
  );
};

export default BlogEditor;
