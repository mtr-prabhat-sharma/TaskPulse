import { useEffect, useState } from "react";
import socket from "../services/socket";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    socket.emit("join", userId);

    socket.on("notification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <div>
      🔔 ({notifications.length})

      <div>
        {notifications.map((n, i) => (
          <div key={i}>
            {n.message} - {new Date(n.time).toLocaleTimeString()}
          </div>
        ))}
      </div>
    </div>
  );
}