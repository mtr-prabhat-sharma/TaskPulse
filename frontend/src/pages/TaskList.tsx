import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/tasklist.css";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/tasks").then((res) => setTasks(res.data));
  }, []);

  return (
    <div className="container">
      <h2 className="title">📋 Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <div className="task-grid">
          {tasks.map((t: any) => (
            <div
              key={t.id}
              className="task-card"
              onClick={() => navigate(`/tasks/${t.id}`)}
            >
              <h3>{t.title}</h3>
              <p>Status: {t.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}