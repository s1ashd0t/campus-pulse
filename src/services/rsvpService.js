import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { createNotification } from "./notificationService";

/**
 * RSVP to an event
 * @param {string} userId - The user ID
 * @param {string} eventId - The event ID
 * @param {string} status - The RSVP status (going, maybe, not-going)
 * @returns {Promise<Object>} - Success status and any error
 */
export const rsvpToEvent = async (userId, eventId, status = "going") => {
  try {
    // Check if user already has an RSVP
    const q = query(
      collection(db, "rsvps"),
      where("userId", "==", userId),
      where("eventId", "==", eventId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Update existing RSVP
      const rsvpDoc = querySnapshot.docs[0];
      await updateDoc(doc(db, "rsvps", rsvpDoc.id), {
        status,
        updatedAt: Timestamp.now()
      });
    } else {
      // Create new RSVP
      await addDoc(collection(db, "rsvps"), {
        userId,
        eventId,
        status,
        createdAt: Timestamp.now()
      });
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get user's RSVP status for an event
 * @param {string} userId - The user ID
 * @param {string} eventId - The event ID
 * @returns {Promise<Object>} - Success status, RSVP status, and any error
 */
export const getUserRsvpStatus = async (userId, eventId) => {
  try {
    const q = query(
      collection(db, "rsvps"),
      where("userId", "==", userId),
      where("eventId", "==", eventId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const rsvpData = querySnapshot.docs[0].data();
      return { success: true, status: rsvpData.status };
    }
    
    return { success: true, status: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get all RSVPs for an event
 * @param {string} eventId - The event ID
 * @returns {Promise<Object>} - Success status, RSVPs array, and any error
 */
export const getEventRsvps = async (eventId) => {
  try {
    const q = query(
      collection(db, "rsvps"),
      where("eventId", "==", eventId)
    );
    
    const querySnapshot = await getDocs(q);
    const rsvps = [];
    
    querySnapshot.forEach((doc) => {
      rsvps.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, rsvps };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Cancel an RSVP
 * @param {string} userId - The user ID
 * @param {string} eventId - The event ID
 * @returns {Promise<Object>} - Success status and any error
 */
export const cancelRsvp = async (userId, eventId) => {
  try {
    const q = query(
      collection(db, "rsvps"),
      where("userId", "==", userId),
      where("eventId", "==", eventId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const rsvpDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, "rsvps", rsvpDoc.id));
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Send RSVP confirmation notification
 * @param {string} userId - The user ID
 * @param {string} eventId - The event ID
 * @param {string} eventTitle - The event title
 * @param {string} status - The RSVP status
 * @returns {Promise<Object>} - Success status and any error
 */
export const sendRsvpConfirmation = async (userId, eventId, eventTitle, status) => {
  try {
    let message = "";
    
    switch (status) {
      case "going":
        message = `You're confirmed for: ${eventTitle}`;
        break;
      case "maybe":
        message = `You've marked 'Maybe' for: ${eventTitle}`;
        break;
      case "not-going":
        message = `You've declined: ${eventTitle}`;
        break;
      default:
        message = `RSVP updated for: ${eventTitle}`;
    }
    
    return await createNotification(
      userId,
      "rsvp",
      message,
      eventId
    );
  } catch (error) {
    return { success: false, error: error.message };
  }
};
