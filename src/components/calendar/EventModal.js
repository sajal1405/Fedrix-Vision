import React, { useState } from "react";

const EventModal = ({ date, onClose, onSave }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ title });
  };

  return (
    <div style={modalStyles.backdrop}>
      <div style={modalStyles.modal}>
        <h4>Add Event for {date.toDateString()}</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Event title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={modalStyles.input}
          />
          <button type="submit" style={modalStyles.button}>Add</button>
          <button type="button" style={modalStyles.cancel} onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

const modalStyles = {
  backdrop: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#111",
    padding: "2rem",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center",
  },
  input: {
    width: "100%", padding: "0.6rem", margin: "1rem 0", background: "#000",
    color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px",
  },
  button: {
    background: "#6f0c8a", color: "#fff", padding: "0.6rem 1rem", marginRight: "1rem", borderRadius: "6px",
  },
  cancel: {
    background: "#555", color: "#fff", padding: "0.6rem 1rem", borderRadius: "6px",
  },
};

export default EventModal;
