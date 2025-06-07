import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { AuthContext } from "../context/AuthContext";
import { UserProfileContext } from "../context/UserProfileContext";
import { motion } from "framer-motion";

const ProfileSetup = () => {
  const { user } = useContext(AuthContext);
  const { saveProfile } = useContext(UserProfileContext);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const seed = encodeURIComponent(user.id || "user");
      setAvatar(`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}`);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { user: supaUser },
    } = await supabase.auth.getUser();

    if (!supaUser) return;

    const profileData = {
      id: supaUser.id,
      email: supaUser.email,
      name,
      company,
      avatar,
      tier:
        supaUser.email === "sajal@fedrixgroup.com"
          ? "superadmin"
          : supaUser.email.includes("admin")
            ? "admin"
            : "client",
    };

    await supabase.from("profiles").upsert(profileData);
    saveProfile(profileData);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative z-10">
      <motion.div
        data-aos="zoom-in"
        className="w-full max-w-lg bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <h2 className="text-center text-2xl font-bold mb-6 text-white">🚀 Setup Your Profile</h2>

        <div className="flex justify-center mb-4">
          <img
            src={avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full border-4 border-gray-700 shadow-md bg-black p-1"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 rounded-md bg-black border border-white/10 text-white placeholder-white/60"
          />

          <input
            type="text"
            placeholder="Company / Brand"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full p-3 rounded-md bg-black border border-white/10 text-white placeholder-white/60"
          />

          <motion.button
            type="submit"
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg shadow-lg transition-all"
          >
            Save & Continue →
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileSetup;
