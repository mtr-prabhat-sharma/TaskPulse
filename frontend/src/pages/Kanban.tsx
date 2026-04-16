import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/kanban.css";

export default function Kanban() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();

    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      setRole(decoded.role);
    }
  }, []);

  const getTasks = (status: string) =>
    tasks.filter((t) => t.status === status);

  return (
    <div className="kanban-wrapper">
      <div className="kanban-top">
        <h2>📊 Kanban Board</h2>

        <div className="top-actions">
          {role === "MANAGER" && (
            <button
              className="create-btn"
              onClick={() => navigate("/tasks")}
            >
              ➕ Create Task
            </button>
          )}

          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      
      <div className="kanban-container">
        {/* Pending */}
        <div className="column">
          <h3>🟡 Pending</h3>
          {getTasks("PENDING").map((t) => (
            <div
              key={t.id}
              className="card"
              onClick={() => navigate(`/tasks/${t.id}`)}
            >
              <b>{t.title}</b>
            </div>
          ))}
        </div>

        
        <div className="column">
          <h3>🔵 In Progress</h3>
          {getTasks("IN_PROGRESS").map((t) => (
            <div
              key={t.id}
              className="card"
              onClick={() => navigate(`/tasks/${t.id}`)}
            >
              <b>{t.title}</b>
            </div>
          ))}
        </div>

        
        <div className="column">
          <h3>🟢 Completed</h3>
          {getTasks("COMPLETED").map((t) => (
            <div
              key={t.id}
              className="card"
              onClick={() => navigate(`/tasks/${t.id}`)}
            >
              <b>{t.title}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}