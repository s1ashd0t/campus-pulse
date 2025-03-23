// src/components/CreateEvent.jsx
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";

export default function CreateEvent() {
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    location: "",
    description: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "events"), eventData);
      alert("Event created!");
      setEventData({ title: "", date: "", location: "", description: "" });
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  return (
    <div className="create-event">

    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Event Title"
        value={eventData.title}
        onChange={(e) => setEventData({...eventData, title: e.target.value})}
      />
      <input
        type="datetime-local"
        value={eventData.date}
        onChange={(e) => setEventData({...eventData, date: e.target.value})}
      />
      <input
        type="text"
        placeholder="Location"
        value={eventData.location}
        onChange={(e) => setEventData({...eventData, location: e.target.value})}
      />
      <textarea
        placeholder="Description"
        value={eventData.description}
        onChange={(e) => setEventData({...eventData, description: e.target.value})}
      />
      <button type="submit">Create Event</button>
    </form>
  </div>
  );
}