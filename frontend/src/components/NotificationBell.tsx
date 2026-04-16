import { useEffect, useState } from "react";
import socket from "../services/socket";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    // Join user room
    socket.emit("join", userId);

    // Listen for notifications
    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  return (
    <div style={{ position: "fixed", top: 20, right: 20 }}>
      {/* Bell Icon */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          cursor: "pointer",
          fontSize: "20px",
          background: "#fff",
          padding: "10px",
          borderRadius: "50%",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        }}
      >
        🔔 ({notifications.length})
      </div>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            marginTop: "10px",
            width: "250px",
            maxHeight: "300px",
            overflowY: "auto",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            padding: "10px",
          }}
        >
          {notifications.length === 0 ? (
            <p style={{ textAlign: "center" }}>No notifications</p>
          ) : (
            notifications.map((n, i) => (
              <div
                key={i}
                style={{
                  borderBottom: "1px solid #eee",
                  padding: "8px 0",
                }}
              >
                <div style={{ fontSize: "14px" }}>{n.message}</div>
                <div style={{ fontSize: "10px", color: "gray" }}>
                  {new Date(n.time).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}