import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { UserProfileContext } from "../context/UserProfileContext";
import { supabase } from "../supabaseClient";

const ProfileSettings = () => {
  const { profile, saveProfile } = useContext(UserProfileContext);
  const [bio, setBio] = useState(profile?.bio || "");
  const [experience, setExperience] = useState(profile?.experience || "");
  const [social, setSocial] = useState(profile?.social_links || "");

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile) return;

    const updates = { bio, experience, social_links: social };
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", profile.id)
      .select()
      .single();

    if (!error && data) {
      saveProfile({ ...profile, ...data });
    }
  };

  return (
    <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-white text-2xl font-bold mb-4">Profile Settings</h2>
      <form onSubmit={handleSave} className="space-y-4">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Bio"
          className="w-full p-3 rounded-md bg-black border border-white/10 text-white"
        />
        <textarea
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          placeholder="Experience"
          className="w-full p-3 rounded-md bg-black border border-white/10 text-white"
        />
        <input
          type="text"
          value={social}
          onChange={(e) => setSocial(e.target.value)}
          placeholder="Social Links"
          className="w-full p-3 rounded-md bg-black border border-white/10 text-white"
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          className="bg-fedrix text-white px-6 py-2 rounded-md"
        >
          Save Settings
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ProfileSettings;
