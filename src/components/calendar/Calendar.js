import React, { useEffect, useState } from "react";
import EventModal from "./EventModal";
import { getDaysInMonth, getFirstDayOffset } from "../../utils/dateUtils";
import { supabase } from "../../supabaseClient";

const Calendar = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const daysInMonth = getDaysInMonth(year, month);
  const offset = getFirstDayOffset(year, month);

  const fetchEvents = async () => {
    const { data } = await supabase.from("events").select("*");
    if (data) setEvents(data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openModal = (day) => setSelectedDate(new Date(year, month, day));
  const closeModal = () => setSelectedDate(null);

  const addEvent = async (event) => {
    await supabase.from("events").insert({
      title: event.title,
      date: selectedDate.toISOString().slice(0, 10), // format YYYY-MM-DD
    });
    fetchEvents();
    closeModal();
  };

  const renderDays = () => {
    const cells = [];
    for (let i = 0; i < offset; i++) cells.push(<div key={`empty-${i}`} className="empty-day" />);
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day).toDateString();
      const hasEvent = events.some((e) => new Date(e.date).toDateString() === currentDate);
      cells.push(
        <div
          key={day}
          className="calendar-day"
          onClick={() => openModal(day)}
        >
          <span>{day}</span>
          {hasEvent && <div className="dot" />}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="calendar-container">
      <h3>
        {today.toLocaleString("default", { month: "long" })} {year}
      </h3>
      <div className="calendar-grid">{renderDays()}</div>
      {selectedDate && <EventModal date={selectedDate} onClose={closeModal} onSave={addEvent} />}
    </div>
  );
};

export default Calendar;
