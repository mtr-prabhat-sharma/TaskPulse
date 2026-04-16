import { useEffect, useState } from "react";
import { api } from "../services/api";
import { jwtDecode } from "jwt-decode";
import "../styles/tasklist.css";

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState("");

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
    const res = await api.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();

    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);
      setRole(decoded.role);
    }
  }, []);

  //Create task
  const createTask = async () => {
    await api.post("/tasks", form);
    setShowForm(false);
    fetchTasks();
  };

  const startTask = async (id: string) => {
    await api.patch(`/tasks/${id}/start`);
    fetchTasks();
  };

  const completeTask = async (id: string) => {
    await api.patch(`/tasks/${id}/complete`);
    fetchTasks();
  };

  const approveTask = async (id: string) => {
    await api.patch(`/tasks/${id}/approve`);
    fetchTasks();
  };

  const returnTask = async (id: string) => {
    await api.patch(`/tasks/${id}/return`);
    fetchTasks();
  };

  return (
    <div className="container">
      <div className="top-bar">
        <h2 className="header">📋 Task Management</h2>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          🚪 Logout
        </button>
      </div>

      {role === "MANAGER" && (
        <button className="create-btn" onClick={() => setShowForm(true)}>
          ➕ New Task
        </button>
      )}

      {role === "MANAGER" && showForm && (
        <div className="form">
          <input
            className="input"
            placeholder="Task Title"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            className="textarea"
            placeholder="Description"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="row">
            <select
              className="input"
              onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
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
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
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

          <div className="actions">
            {role === "EMPLOYEE" && t.status === "PENDING" && (
              <button className="btn btn-start" onClick={() => startTask(t.id)}>
                ▶ Start
              </button>
            )}

            {role === "EMPLOYEE" && t.status === "IN_PROGRESS" && (
              <button
                className="btn btn-complete"
                onClick={() => completeTask(t.id)}
              >
                ✔ Complete
              </button>
            )}

            {role === "MANAGER" && t.status === "COMPLETED" && (
              <>
                <button
                  className="btn btn-approve"
                  onClick={() => approveTask(t.id)}
                >
                  👍 Approve
                </button>

                <button
                  className="btn btn-return"
                  onClick={() => returnTask(t.id)}
                >
                  ↩ Return
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
