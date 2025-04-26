import { collection, addDoc, query, where, orderBy, getDocs, Timestamp, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Create a new notification
 * @param {string} userId - The user ID to send the notification to
 * @param {string} type - The type of notification (event, admin, points, etc.)
 * @param {string} message - The notification message
 * @param {string} relatedId - Optional ID of related item (event, etc.)
 * @returns {Promise<Object>} - Success status and any error
 */
export const createNotification = async (userId, type, message, relatedId = null) => {
  try {
    await addDoc(collection(db, "notifications"), {
      userId,
      type, // "event", "admin", "points", etc.
      message,
      relatedId, // ID of related item (event, etc.)
      read: false,
      createdAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get notifications for a specific user
 * @param {string} userId - The user ID to get notifications for
 * @returns {Promise<Object>} - Success status, notifications array, and any error
 */
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
      notifications.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt.toDate().toISOString().split('T')[0]
      });
    });
    
    return { success: true, notifications };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId - The notification ID to mark as read
 * @returns {Promise<Object>} - Success status and any error
 */
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

/**
 * Create an event notification for all users or specific users
 * @param {string} eventId - The event ID
 * @param {string} eventTitle - The event title
 * @param {Array<string>} userIds - Optional array of user IDs to notify (if null, notify all users)
 * @returns {Promise<Object>} - Success status and any error
 */
export const createEventNotification = async (eventId, eventTitle, userIds = null) => {
  try {
    // If userIds is provided, send notifications only to those users
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
    
    // Otherwise, we would need to get all users and send to everyone
    // This is a placeholder - in a real app, you'd implement a more efficient solution
    // such as a cloud function or a pub/sub system
    return { success: true, message: "Notification would be sent to all users" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Create a points notification for a user
 * @param {string} userId - The user ID
 * @param {number} points - The number of points earned
 * @param {string} reason - The reason for earning points
 * @returns {Promise<Object>} - Success status and any error
 */
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

/**
 * Create an admin notification for a specific user
 * @param {string} userId - The user ID
 * @param {string} message - The notification message
 * @returns {Promise<Object>} - Success status and any error
 */
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
