// src/pages/Admin.jsx
import { useAuth } from "../context/AuthContext";
import CreateEvent from "./components/CreateEvent";
import CreateNews from "./components/CreateNews";
import EventList from "./components/EventList";
import CurrentUsers from "./components/CurrentUsers";
import "./admin.css"; // Assuming you have a CSS file for admin styles

const Admin = () => {
  // const { isAdmin } = useAuth();

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>
      <div className="admin-content">
        <div className="admin-section">
          <CreateEvent />
        </div>
        <div className="news-section">
          <CreateNews />
        </div>
        <div >
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
