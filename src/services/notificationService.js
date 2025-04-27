import { collection, addDoc, query, where, orderBy, getDocs, Timestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export const createNotification = async (userId, type, message, relatedId = null) => {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      type,
      message,
      relatedId,
      read: false,
      createdAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

//Fixed getUserNotifications with safe date handling
export const getUserNotifications = async (userId) => {
  try {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const notifications = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log("Notification data:", data); // Debugging line

      notifications.push({
        id: doc.id,
        ...data,
        date: data.createdAt
          ? data.createdAt.toDate().toISOString().split('T')[0]
          : "Unknown date" // Safe fallback if createdAt is missing
      });
    });

    return { success: true, notifications };
  } catch (error) {
    console.error("Error in getUserNotifications:", error);
    return { success: false, error: error.message };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await updateDoc(doc(db, "notifications", notificationId), {
      read: true
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createEventNotification = async (eventId, eventTitle, userIds = null) => {
  try {
    if (userIds && Array.isArray(userIds)) {
      const promises = userIds.map(userId => 
        createNotification(
          userId, 
          "event", 
          `New Event: ${eventTitle}`, 
          eventId
        )
      );

      await Promise.all(promises);
      return { success: true };
    }

    return { success: true, message: "Notification would be sent to all users" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createPointsNotification = async (userId, points, reason) => {
  try {
    return await createNotification(
      userId,
      "points",
      `You earned ${points} points for ${reason}!`,
      null
    );
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createAdminNotification = async (userId, message) => {
  try {
    return await createNotification(
      userId,
      "admin",
      message,
      null
    );
  } catch (error) {
    return { success: false, error: error.message };
  }
};
