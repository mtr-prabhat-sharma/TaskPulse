import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TaskList from "./pages/TaskList";
import TaskDetail from "./pages/TaskDetail";
import NotificationBell from "./components/NotificationBell";
import Login from "./pages/Login";
import Kanban from "./pages/Kanban";

const ProtectedRoute = ({ children }: any) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      
      <NotificationBell />

      <Routes>

        <Route path="/" element={<Login />} />

          <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <TaskDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/kanban" element={<Kanban />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;