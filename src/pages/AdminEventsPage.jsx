import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import EventManagement from "./components/EventManagement";
import CreateEvent from "./components/CreateEvent";
import "../styles/components.css";

const AdminEventsPage = () => {
  const [activeTab, setActiveTab] = useState("manage"); // manage, create
  const navigate = useNavigate();

  return (
    <div className="admin-events-container">
      <h1>Event Administration</h1>
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === "manage" ? "active" : ""}`}
          onClick={() => setActiveTab("manage")}
        >
          Manage Events
        </button>
        <button 
          className={`tab-button ${activeTab === "create" ? "active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          Create Event
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === "manage" ? (
          <EventManagement />
        ) : (
          <CreateEvent 
            onSuccess={() => {
              setActiveTab("manage");
              // Show a success message or redirect
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AdminEventsPage;
