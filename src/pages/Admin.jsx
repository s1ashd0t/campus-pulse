// src/pages/Admin.jsx
import { useAuth } from "../context/AuthContext";
import CreateEvent from "./components/CreateEvent";
import CreateNews from "./components/CreateNews";
import EventList from "./components/EventList";
import CurrentUsers from "./components/CurrentUsers";
import "./Admin.css"; // Assuming you have a CSS file for admin styles

const Admin = () => {
  // const { isAdmin } = useAuth();

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <div className="admin-content">
        <div className="admin-section">
          <CreateEvent />
        </div>
        <div className="admin-section">
          <CreateNews />
        </div>
        <div className="admin-section">
          <EventList />
        </div>
        <div className="admin-section">
          <CurrentUsers />
        </div>
      </div>
    </div>
  );
};

export default Admin;
