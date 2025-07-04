import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"; // eslint-disable-line no-unused-vars
import { supabase } from "../../supabaseClient";
import { motion } from "framer-motion";

const roles = ["super_admin", "admin", "member", "user"];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("id, email, full_name, role")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Fetch users error", error);
      setErrorMsg(error.message || "Failed to fetch users");
      setUsers([]);
    } else {
      setErrorMsg("");
      setUsers(data || []);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });
    if (error) {
      console.error("Signup error", error);
      setErrorMsg(error.message || "Signup failed");
      return;
    }

    const { user } = data;
    const { error: insertError } = await supabase.from("user_profiles").insert({
      id: user.id,
      email: user.email,
      role,
      full_name: '',
    });
    if (insertError) {
      console.error("Profile insert error", insertError);
      setErrorMsg(insertError.message || "Failed to create profile");
      return;
    }

    setEmail("");
    setPassword("");
    setRole("user");
    setErrorMsg("");
    fetchUsers();
  };

  const updateRole = async (id, newRole) => {
    const { error: updateError } = await supabase
      .from("user_profiles")
      .update({ role: newRole })
      .eq("id", id);
    if (updateError) {
      console.error("Update role error", updateError);
      setErrorMsg(updateError.message || "Failed to update role");
      return;
    }
    try {
      await supabase.auth.admin.updateUserById(id, {
        user_metadata: { role: newRole },
      });
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to update auth role");
    }
    setErrorMsg("");
    fetchUsers();
  };

  return (
    <motion.div
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-white text-2xl font-bold flex items-center gap-2">
        👥 User Management
      </h2>
      {errorMsg && (
        <div className="text-red-400 bg-white/5 border border-red-400/50 p-2 rounded-md">
          {errorMsg}
        </div>
      )}
      <form
        onSubmit={handleCreate}
        className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="User email"
            required
            className="flex-1 p-2 rounded-md bg-black border border-white/10 text-white"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Temporary password"
            required
            className="flex-1 p-2 rounded-md bg-black border border-white/10 text-white"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="p-2 rounded-md bg-black border border-white/10 text-white"
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Create User
        </button>
      </form>
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-x-auto">
        <table className="min-w-full text-left text-white">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-3">Email</th>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-white/5">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.full_name || "-"}</td>
                <td className="p-3">
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u.id, e.target.value)}
                    className="bg-black border border-white/10 rounded-md p-1"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

UserManagement.propTypes = {};

export default UserManagement;
