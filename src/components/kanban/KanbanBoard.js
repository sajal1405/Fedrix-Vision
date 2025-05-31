import React, { useEffect, useState } from "react";
import KanbanColumn from "./KanbanColumn";
import { supabase } from "../../supabaseClient";

const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    todo: [],
    inProgress: [],
    review: [],
    done: [],
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase.from("tasks").select("*");
    if (!error && data) {
      const grouped = {
        todo: [],
        inProgress: [],
        review: [],
        done: [],
      };
      data.forEach((task) => grouped[task.status].push(task));
      setColumns(grouped);
    }
  };

  const handleDrop = async (card, sourceCol, targetCol) => {
    if (sourceCol === targetCol) return;

    const updatedCard = { ...card, status: targetCol };
    await supabase.from("tasks").update({ status: targetCol }).eq("id", card.id);
    fetchTasks();
  };

  return (
    <div style={{ display: "flex", gap: "1rem", padding: "2rem", overflowX: "auto" }}>
      {Object.keys(columns).map((status) => (
        <KanbanColumn
          key={status}
          title={status}
          cards={columns[status]}
          onDrop={(card, sourceCol) => handleDrop(card, sourceCol, status)}
          sourceCol={status}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
