import React, { useEffect, useState, useContext } from "react";
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { FaTrash, FaCheck, FaStar } from "react-icons/fa";
import "./Notifications.css";

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        const notifRef = collection(db, "notifications");
        const q = query(notifRef, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const notifList = [];
        querySnapshot.forEach((docSnap) => {
          notifList.push({ id: docSnap.id, ...docSnap.data() });
        });

        setNotifications(notifList);
      }
    };

    fetchNotifications();
  }, [user]);

  const toggleRead = async (id, currentStatus) => {
    try {
      const notifDoc = doc(db, "notifications", id);
      await updateDoc(notifDoc, { read: !currentStatus });

      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: !currentStatus } : notif
        )
      );
    } catch (error) {
      console.error("Error updating notification:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const notifDoc = doc(db, "notifications", id);
      await deleteDoc(notifDoc);

      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  if (!user) {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <div className="notifications-container">
      <h1>🔔 Notifications</h1>
      <ul>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <li key={notif.id} className="notification-card">
              <div className="notification-content">
                <div className="notification-text">
                  <span className={notif.read ? "read" : "unread"}>
                    {notif.message}
                  </span>
                  <small>{notif.date}</small>
                </div>
                <div className="notification-actions">
                  <span
                    className="action-icon"
                    title={notif.read ? "Mark Unread" : "Mark Read"}
                    onClick={() => toggleRead(notif.id, notif.read)}
                  >
                    {notif.read ? <FaStar /> : <FaCheck />}
                  </span>
                  <span
                    className="action-icon"
                    title="Delete Notification"
                    onClick={() => deleteNotification(notif.id)}
                  >
                    <FaTrash />
                  </span>
                </div>
              </div>
            </li>
          ))
        ) : (
          <p>No notifications found.</p>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
