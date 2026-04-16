import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import "../styles/taskdetail.css";

export default function TaskDetail() {
  const { id } = useParams();

  const [task, setTask] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [time, setTime] = useState(0);

  // Fetch task
  const fetchTask = async () => {
    const res = await api.get("/tasks");
    const found = res.data.find((t: any) => t.id === id);
    setTask(found);
  };

  // Fetch comments
  const fetchComments = async () => {
    const res = await api.get(`/comments/${id}`);
    setComments(res.data);
  };

  useEffect(() => {
    fetchTask();
    fetchComments();
  }, [id]);

  // ⏱ Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ▶️ Start Task
  const startTask = async () => {
    await api.patch(`/tasks/${id}/start`);
    fetchTask();
  };

  // ✅ Complete Task
  const completeTask = async () => {
    await api.patch(`/tasks/${id}/complete`);
    fetchTask();
  };

  // 💬 Add Comment
  const addComment = async () => {
    await api.post(`/comments/${id}`, { text });
    setText("");
    fetchComments();
  };

  if (!task) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">{task.title}</h2>

        <p className={`status ${task.status}`}>Status: {task.status}</p>

        <p>{task.description}</p>

        {/* Buttons */}
        <div className="buttons">
          <button className="button start" onClick={startTask}>
            Start
          </button>
          <button className="button complete" onClick={completeTask}>
            Complete
          </button>
        </div>

        {/* Timer */}
        <div className="timer">⏱ Time: {time}s</div>

        {/* Comments */}
        <div className="comments">
          <h3>💬 Comments</h3>

          {comments.map((c) => (
            <div key={c.id} className="comment-box">
              {c.text}
              <div style={{ fontSize: "10px", color: "gray" }}>
                {new Date(c.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))}

          <div style={{ marginTop: "10px" }}>
            <input
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write comment"
            />
            <button className="button" onClick={addComment}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
