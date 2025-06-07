import React, { useContext } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { UserProfileContext } from "../context/UserProfileContext";

const Profile = () => {
  const { profile } = useContext(UserProfileContext);

  if (!profile) {
    return <div className="p-6 text-white">No profile loaded.</div>;
  }

  return (
    <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-4 mb-6">
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full border border-white/10"
          />
        )}
        <div>
          <h2 className="text-white text-2xl font-bold">{profile.name}</h2>
          <p className="text-white/60">{profile.email}</p>
        </div>
      </div>
      <div className="text-white space-y-2">
        {profile.company && (
          <p>
            <strong>Company:</strong> {profile.company}
          </p>
        )}
        {profile.bio && (
          <p>
            <strong>Bio:</strong> {profile.bio}
          </p>
        )}
        {profile.experience && (
          <p>
            <strong>Experience:</strong> {profile.experience}
          </p>
        )}
        {profile.social_links && (
          <p>
            <strong>Social:</strong> {profile.social_links}
          </p>
        )}
      </div>
      <Link to="/dashboard/settings" className="text-fedrix mt-4 inline-block">
        Edit Profile
      </Link>
    </motion.div>
  );
};

export default Profile;
