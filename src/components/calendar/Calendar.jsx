import React, { useState, useEffect, useContext, useCallback } from "react";
import { Calendar as BigCalendar, dayjsLocalizer } from "react-big-calendar";
import dayjs from "dayjs";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { supabase } from "../../supabaseClient";
import { UserProfileContext } from "../../context/UserProfileContext";
import EventModal from "./EventModal.jsx";

const localizer = dayjsLocalizer(dayjs);

const Calendar = () => {
  const { profile } = useContext(UserProfileContext);

  const [events, setEvents] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = useCallback(async () => {
    const { data } = await supabase.from("events").select("*").order("start", { ascending: true });

    const filtered =
      profile?.role === "admin"
        ? data
        : data.filter((e) => e.created_by === profile?.id);

    const mapped = filtered.map((ev) => ({
      ...ev,
      start: new Date(ev.start),
      end: new Date(ev.end),
    }));

    setEvents(mapped);
  }, [profile?.id, profile?.role]);

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
  }, [profile?.id, fetchEvents]);

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
      type: data.type,
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

  const eventPropGetter = (event) => {
    const colors = {
      meeting: "#9b5de5",
      appointment: "#00f5d4",
      reminder: "#00bbf9",
    };
    return {
      style: {
        backgroundColor: colors[event.type] || "#f15bb5",
      },
    };
  };

  const types = [...new Set(events.map((e) => e.type))];
  const visibleEvents = filterType
    ? events.filter((e) => e.type === filterType)
    : events;

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-xl text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">📅 Fedrix Event Calendar</h3>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-black border border-white/20 text-sm px-2 py-1 rounded-md"
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <BigCalendar
        localizer={localizer}
        events={visibleEvents}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventPropGetter}
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
