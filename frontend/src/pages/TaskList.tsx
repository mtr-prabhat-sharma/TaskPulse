import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get("/tasks").then((res) => setTasks(res.data));
  }, []);

  return (
    <div>
      <h2>Tasks</h2>
      {tasks.map((t: any) => (
        <div key={t.id}>
          {t.title} - {t.status}
        </div>
      ))}
    </div>
  );
}