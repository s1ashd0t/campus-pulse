// src/pages/Admin.jsx
import { useAuth } from "../context/AuthContext";
import CreateEvent from "./components/CreateEvent";
import EventList from "./components/EventList";
import "./Admin.css";

const Admin = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <div className="admin-content">
        <div className="admin-section">
          <h2>Create New Event</h2>
          <CreateEvent />
        </div>
        <div className="admin-section">
          <h2>Manage Events</h2>
          <EventList />
        </div>
      </div>
    </div>
  );
};

export default Admin;
