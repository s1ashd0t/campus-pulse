import { collection, addDoc, query, where, orderBy, getDocs, Timestamp, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

export const createNotification = async (userId, type, message, relatedId = null) => {
  try {
    const docRef = await addDoc(collection(db, "notifications"), {
      userId,
      type,
      message,
      relatedId,
      read: false,
      important: false,
      createdAt: Timestamp.now()
    });
    return { success: true, notificationId: docRef.id };
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
      console.log("Notification data:", data);

      notifications.push({
        id: doc.id,
        ...data,
        date: data.createdAt
          ? data.createdAt.toDate().toISOString().split('T')[0]
          : "Unknown date" //safe fallback 
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

export const updateNotification = async (notificationId, updates) => {
  try {
    await updateDoc(doc(db, "notifications", notificationId), updates);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    await deleteDoc(doc(db, "notifications", notificationId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteMultipleNotifications = async (notificationIds) => {
  try {
    const promises = notificationIds.map(id => deleteNotification(id));
    await Promise.all(promises);
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
