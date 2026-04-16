import { useEffect, useState } from "react";
import { api } from "../services/api";
import "../styles/tasklist.css";

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "HIGH",
    dueDate: "",
    assigneeId: "",
  });

  const fetchTasks = async () => {
    const res = await api.get("/tasks");
    setTasks(res.data);
  };

  const fetchUsers = async () => {
    const res = await api.get("/users"); // we will create this API
    setUsers(res.data);
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  // 🟢 Create task
  const createTask = async () => {
    await api.post("/tasks", form);
    setShowForm(false);
    fetchTasks();
  };
  return (
  <div className="container">
    <h2 className="header">📋 Task Management</h2>

    <button className="create-btn" onClick={() => setShowForm(true)}>
      ➕ New Task
    </button>

    {showForm && (
      <div className="form">
        {/* Title FULL WIDTH */}
        <input
          className="input"
          placeholder="Task Title"
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        {/* Description FULL WIDTH */}
        <textarea
          className="textarea"
          placeholder="Description"
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {/* Row layout */}
        <div className="row">
          <select
            className="input"
            onChange={(e) =>
              setForm({ ...form, assigneeId: e.target.value })
            }
          >
            <option value="">Select Employee</option>
            {users
              .filter((u) => u.role === "EMPLOYEE")
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
          </select>

          <input
            className="input"
            type="date"
            onChange={(e) =>
              setForm({ ...form, dueDate: e.target.value })
            }
          />
        </div>

        <button className="save-btn" onClick={createTask}>
          Create Task
        </button>
      </div>
    )}

    {tasks.map((t) => (
      <div key={t.id} className="task-card">
        <b>{t.title}</b>
        <p>{t.description}</p>
        <small>Status: {t.status}</small>
      </div>
    ))}
  </div>
);
}
