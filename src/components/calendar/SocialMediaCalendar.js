import React, { useEffect, useState, useContext, useCallback } from "react";
import dayjs from "dayjs";
import { supabase } from "../../supabaseClient";
import { UserProfileContext } from "../../context/UserProfileContext";
import { AuthContext } from "../../context/AuthContext";
import { AgentAIContext } from "../../context/AgentAIContext";

const SocialMediaCalendar = () => {
  const { profile } = useContext(UserProfileContext);
  const { user } = useContext(AuthContext);
  const { generateContent, loading } = useContext(AgentAIContext);
  const [posts, setPosts] = useState([]);
  const [platform, setPlatform] = useState("");
  const [project, setProject] = useState("");
  const [newDate, setNewDate] = useState("");
  const [idea, setIdea] = useState("");
  const [platformInput, setPlatformInput] = useState("");
  const [projectInput, setProjectInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("scheduled_posts")
        .select("*")
        .order("date", { ascending: true });

      if (error) throw error;

      const visible =
        profile?.role === "admin" ? data : data.filter((p) => p.created_by === profile?.id);
      setPosts(visible);
      setErrorMsg("");
    } catch (err) {
      console.error("Fetch posts error", err);
      setErrorMsg(err.message || "Failed to fetch posts");
    }
  }, [profile?.id, profile?.role]);

  useEffect(() => {
    if (!user?.email) return;
    fetchPosts();

    const channel = supabase
      .channel("social-posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "scheduled_posts" }, fetchPosts)
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user?.email, profile?.id, fetchPosts]);

  const filtered = posts.filter(
    (p) =>
      (!platform || p.platform === platform) &&
      (!project || p.project === project)
  );

  const platforms = [...new Set(posts.map((p) => p.platform))];
  const projects = [...new Set(posts.map((p) => p.project))];

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newDate || !idea) return;
    try {
      const content = await generateContent(idea);
      const { error } = await supabase.from("scheduled_posts").insert({
        content,
        date: newDate,
        platform: platformInput,
        project: projectInput,
        approved: false,
        created_by: profile?.id,
      });
      if (error) throw error;
      setIdea("");
      setNewDate("");
      setPlatformInput("");
      setProjectInput("");
      setErrorMsg("");
      fetchPosts();
    } catch (err) {
      console.error("Create post error", err);
      setErrorMsg(err.message || "Failed to create post");
    }
  };

  return (
    <div className="mt-10 bg-white/5 p-6 border border-white/10 rounded-xl shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg text-white font-semibold">📲 Social Media Schedule</h3>
        <div className="flex gap-4">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="bg-black border border-white/20 text-white text-sm px-3 py-1 rounded-md"
          >
            <option value="">All Platforms</option>
            {platforms.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>

          <select
            value={project}
            onChange={(e) => setProject(e.target.value)}
            className="bg-black border border-white/20 text-white text-sm px-3 py-1 rounded-md"
          >
            <option value="">All Projects</option>
            {projects.map((p, i) => (
              <option key={i} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {errorMsg && (
        <div className="text-red-400 bg-white/5 border border-red-400/50 p-2 rounded-md mb-4">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleAdd} className="mb-6 space-y-3">
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Content idea"
          className="w-full p-2 bg-black border border-white/20 rounded-md text-white"
        />
        <div className="grid grid-cols-3 gap-2">
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="p-2 bg-black border border-white/20 rounded-md text-white"
          />
          <input
            type="text"
            value={platformInput}
            onChange={(e) => setPlatformInput(e.target.value)}
            placeholder="Platform"
            className="p-2 bg-black border border-white/20 rounded-md text-white"
          />
          <input
            type="text"
            value={projectInput}
            onChange={(e) => setProjectInput(e.target.value)}
            placeholder="Project"
            className="p-2 bg-black border border-white/20 rounded-md text-white"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-1 bg-gray-700 rounded-md text-sm disabled:opacity-50"
        >
          {loading ? "Generating..." : "Add Draft"}
        </button>
      </form>

      <ul className="space-y-4">
        {filtered.length === 0 && (
          <li className="text-white/60 text-sm">No posts found for selected filters.</li>
        )}
        {filtered.map((post) => (
          <li
            key={post.id}
            className="bg-black/40 border border-white/10 p-4 rounded-lg text-white flex justify-between items-center"
          >
            <div>
              <h4 className="text-base font-semibold">{post.content}</h4>
              <p className="text-white/50 text-sm">
                {post.platform} • {post.project}
              </p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-white/60 bg-gray-700/10 border border-gray-700 px-3 py-1 rounded-full mb-1">
                {dayjs(post.date).format("MMM D")}
              </span>
              {!post.approved && (
                <span className="text-[10px] text-yellow-400">Draft</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialMediaCalendar;
