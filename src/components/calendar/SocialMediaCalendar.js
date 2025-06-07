import React, { useEffect, useState, useContext, useCallback } from "react";
import moment from "moment";
import { supabase } from "../../supabaseClient";
import { UserProfileContext } from "../../context/UserProfileContext";
import { AuthContext } from "../../context/AuthContext";

const SocialMediaCalendar = () => {
  const { profile } = useContext(UserProfileContext);
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [platform, setPlatform] = useState("");
  const [project, setProject] = useState("");

  const fetchPosts = useCallback(async () => {
    const { data } = await supabase
      .from("scheduled_posts")
      .select("*")
      .order("date", { ascending: true });

    const visible =
      profile?.tier === "admin" ? data : data.filter((p) => p.created_by === profile?.id);
    setPosts(visible);
  }, [profile?.id, profile?.tier]);

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
            <span className="text-xs text-white/60 bg-fedrix/10 border border-fedrix px-3 py-1 rounded-full">
              {moment(post.date).format("MMM D")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialMediaCalendar;
