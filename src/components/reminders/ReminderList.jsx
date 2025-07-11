import React, { useState, useEffect, useContext, useCallback } from "react";
import { supabase } from "../../supabaseClient";
import { UserProfileContext } from "../../context/UserProfileContext";

const ReminderList = () => {
  const { profile } = useContext(UserProfileContext);
  const [reminders, setReminders] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchReminders = useCallback(async () => {
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .order("due_date", { ascending: true });

    if (error) {
      console.error("Failed to fetch reminders", error);
      // If you receive a 404, ensure `supabase/create_reminders_table.sql` was run
      // to create the table inside your project.
      setErrorMsg(error.message || "Failed to fetch reminders");
      setReminders([]);
      return;
    }

    const filtered =
      profile?.role === "admin" || profile?.role === "super_admin"
        ? data
        : data.filter((r) => r.created_by === profile?.id);

    setReminders(filtered || []);
    setErrorMsg("");
  }, [profile?.id, profile?.role]);

  useEffect(() => {
    if (!profile?.id) return;
    fetchReminders();
    const channel = supabase
      .channel("reminders-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reminders" },
        fetchReminders
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [profile?.id, fetchReminders]);

  const addReminder = async (e) => {
    e.preventDefault();
    if (!title || !dueDate) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("reminders").insert({
      title,
      due_date: dueDate,
      completed: false,
      created_by: user.id,
    });

    setTitle("");
    setDueDate("");
    fetchReminders();
  };

  const toggleComplete = async (reminder) => {
    await supabase
      .from("reminders")
      .update({ completed: !reminder.completed })
      .eq("id", reminder.id);
    fetchReminders();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={addReminder} className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New reminder"
          className="flex-1 p-2 bg-white/5 border border-white/20 rounded-md text-white"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-2 bg-white/5 border border-white/20 rounded-md text-white"
        />
        <button
          type="submit"
          className="bg-gray-700 text-white px-4 rounded-md"
        >
          Add
        </button>
      </form>
      {errorMsg && (
        <div className="text-red-400 bg-white/5 border border-red-400/50 p-2 rounded-md">
          {errorMsg}
        </div>
      )}
      <ul className="space-y-2" data-testid="reminder-list">
        {reminders.map((r) => (
          <li key={r.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={r.completed}
              onChange={() => toggleComplete(r)}
            />
            <span
              className={`flex-1 text-white ${r.completed ? "line-through text-white/50" : ""}`}
            >
              {r.title}
            </span>
            <span className="text-white/60 text-sm">
              {new Date(r.due_date).toLocaleDateString()}
            </span>
          </li>
        ))}
        {reminders.length === 0 && (
          <li className="text-white/50 text-sm">No reminders.</li>
        )}
      </ul>
    </div>
  );
};

export default ReminderList;
