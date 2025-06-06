import React, { useState, useEffect, useContext } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { supabase } from "../../supabaseClient";
import { UserProfileContext } from "../../context/UserProfileContext";
import { AuthContext } from "../../context/AuthContext";
import EventModal from "./EventModal.jsx";

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const { profile } = useContext(UserProfileContext);
  const { user } = useContext(AuthContext);

  const [events, setEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*").order("start", { ascending: true });

    const filtered =
      profile?.tier === "admin"
        ? data
        : data.filter((e) => e.created_by === profile?.id);

    const mapped = filtered.map((ev) => ({
      ...ev,
      start: new Date(ev.start),
      end: new Date(ev.end),
    }));

    setEvents(mapped);
  };

  useEffect(() => {
    if (!profile?.id) return;
    fetchEvents();

    const channel = supabase
      .channel("events-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "events" }, () => {
        fetchEvents();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [profile?.id]);

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo);
    setSelectedEvent(null);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setSelectedSlot(null);
  };

  const handleModalClose = () => {
    setSelectedSlot(null);
    setSelectedEvent(null);
  };

  const handleSave = async (data) => {
    const base = {
      title: data.title,
      description: data.description,
      start: data.start,
      end: data.end,
      project: data.project,
      tag: data.tag,
      tag_color: data.tag_color,
      priority: data.priority,
    };

    if (selectedEvent?.id) {
      await supabase.from("events").update(base).eq("id", selectedEvent.id);
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await supabase.from("events").insert({
        ...base,
        created_by: user.id,
      });
    }

    handleModalClose();
  };

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-xl text-white">
      <h3 className="text-lg font-semibold mb-4">📅 Fedrix Event Calendar</h3>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        style={{ height: 600, backgroundColor: "#0a0a0a", color: "#fff", borderRadius: "12px" }}
      />

      {(selectedSlot || selectedEvent) && (
        <EventModal
          slot={selectedSlot}
          event={selectedEvent}
          onClose={handleModalClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Calendar;
