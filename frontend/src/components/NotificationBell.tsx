import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    const res = await api.get("/notifications");
    setNotifications(res.data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div style={{ position: "fixed", top: 10, right: 10 }}>
      🔔 {notifications.length}

      <div style={{ background: "white", padding: 10 }}>
        {notifications.map((n) => (
          <div key={n.id}>{n.message}</div>
        ))}
      </div>
    </div>
  );
}