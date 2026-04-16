import { useEffect, useState } from "react";
import { api } from "../services/api";
import "../styles/kanban.css";

export default function Kanban() {
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const getTasks = (status: string) =>
    tasks.filter((t) => t.status === status);

  return (
    <div className="kanban-container">
      <div className="column">
        <h3>🟡 Pending</h3>
        {getTasks("PENDING").map((t) => (
          <div key={t.id} className="card">
            {t.title}
          </div>
        ))}
      </div>

      <div className="column">
        <h3>🔵 In Progress</h3>
        {getTasks("IN_PROGRESS").map((t) => (
          <div key={t.id} className="card">
            {t.title}
          </div>
        ))}
      </div>

      <div className="column">
        <h3>🟢 Completed</h3>
        {getTasks("COMPLETED").map((t) => (
          <div key={t.id} className="card">
            {t.title}
          </div>
        ))}
      </div>
    </div>
  );
}