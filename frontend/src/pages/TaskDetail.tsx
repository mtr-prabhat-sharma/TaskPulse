import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState<any>(null);

  useEffect(() => {
    api.get(`/tasks`).then((res) => {
      const found = res.data.find((t: any) => t.id === id);
      setTask(found);
    });
  }, [id]);

  if (!task) return <div>Loading...</div>;

  return (
    <div>
      <h2>{task.title}</h2>
      <p>Status: {task.status}</p>
    </div>
  );
}