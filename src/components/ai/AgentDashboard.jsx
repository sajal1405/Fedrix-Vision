import React, { useEffect, useState, useContext } from "react";
import { AgentAIContext } from "../../context/AgentAIContext";
import { UserProfileContext } from "../../context/UserProfileContext";
import { supabase } from "../../supabaseClient";

const AgentDashboard = () => {
  const { generateContent, loading } = useContext(AgentAIContext);
  const { profile } = useContext(UserProfileContext);

  const [prompt, setPrompt] = useState("");
  const [date, setDate] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const [project, setProject] = useState("General");
  const [drafts, setDrafts] = useState([]);

  const fetchDrafts = async () => {
    const { data } = await supabase
      .from("scheduled_posts")
      .select("*")
      .order("date", { ascending: true });
    setDrafts(data || []);
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt || !date) return;
    const content = await generateContent(prompt);
    const { data } = await supabase
      .from("scheduled_posts")
      .insert({
        content,
        platform,
        project,
        date,
        approved: false,
        created_by: profile?.id,
      })
      .select("*")
      .single();
    if (data) setDrafts((prev) => [...prev, data]);
    setPrompt("");
  };

  const handleApprove = async (post) => {
    await supabase.from("scheduled_posts").update({ approved: true }).eq("id", post.id);
    fetchDrafts();
  };

  return (
    <div className="space-y-6 text-white">
      <form onSubmit={handleGenerate} className="space-y-4 bg-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="font-semibold text-lg">🤖 Generate Social Post</h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Post idea or prompt"
          className="w-full p-3 bg-black border border-white/20 rounded-md"
        />
        <div className="grid grid-cols-3 gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-3 bg-black border border-white/20 rounded-md"
          />
          <input
            type="text"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            placeholder="Platform"
            className="p-3 bg-black border border-white/20 rounded-md"
          />
          <input
            type="text"
            value={project}
            onChange={(e) => setProject(e.target.value)}
            placeholder="Project"
            className="p-3 bg-black border border-white/20 rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </form>

      <div className="bg-white/5 p-6 rounded-xl border border-white/10">
        <h3 className="font-semibold text-lg mb-4">Draft Posts</h3>
        <ul className="space-y-4">
          {drafts
            .filter((d) => !d.approved)
            .map((d) => (
              <li key={d.id} className="flex justify-between items-start bg-black/40 border border-white/10 p-4 rounded-lg">
                <div>
                  <p className="font-medium">{d.content}</p>
                  <p className="text-sm text-white/60">
                    {d.platform} • {d.project} • {new Date(d.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleApprove(d)}
                  className="bg-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-600"
                >
                  Approve
                </button>
              </li>
            ))}
          {drafts.filter((d) => !d.approved).length === 0 && (
            <li className="text-sm text-white/60">No drafts available.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AgentDashboard;
