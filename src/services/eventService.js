import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, where, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { createEventNotification } from "./notificationService";

/**
 * Create a new event
 * @param {Object} eventData - The event data
 * @param {string} creatorId - The ID of the user creating the event
 * @param {boolean} sendNotification - Whether to send a notification to users
 * @returns {Promise<Object>} - Success status, event ID, and any error
 */
export const createEvent = async (eventData, creatorId, sendNotification = true) => {
  try {
    // Add timestamp fields
    const eventWithTimestamps = {
      ...eventData,
      creatorId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      status: eventData.status || "pending" // pending, approved, rejected
    };
    
    // Add to Firestore
    const docRef = await addDoc(collection(db, "events"), eventWithTimestamps);
    
    // Send notification if requested
    if (sendNotification && eventData.status === "approved") {
      await createEventNotification(docRef.id, eventData.title);
    }
    
    return { success: true, eventId: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get an event by ID
 * @param {string} eventId - The event ID
 * @returns {Promise<Object>} - Success status, event data, and any error
 */
export const getEventById = async (eventId) => {
  try {
    const docRef = doc(db, "events", eventId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { 
        success: true, 
        event: {
          id: docSnap.id,
          ...docSnap.data(),
          date: docSnap.data().date ? new Date(docSnap.data().date) : null
        }
      };
    } else {
      return { success: false, error: "Event not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get all events
 * @param {string} status - Optional status filter (pending, approved, rejected)
 * @returns {Promise<Object>} - Success status, events array, and any error
 */
export const getAllEvents = async (status = null) => {
  try {
    let q;
    
    if (status) {
      q = query(
        collection(db, "events"),
        where("status", "==", status),
        orderBy("date", "asc")
      );
    } else {
      q = query(
        collection(db, "events"),
        orderBy("date", "asc")
      );
    }
    
    const querySnapshot = await getDocs(q);
    const events = [];
    
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date ? new Date(doc.data().date) : null
      });
    });
    
    return { success: true, events };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update an event
 * @param {string} eventId - The event ID
 * @param {Object} eventData - The updated event data
 * @param {boolean} sendNotification - Whether to send a notification if status changes to approved
 * @returns {Promise<Object>} - Success status and any error
 */
export const updateEvent = async (eventId, eventData, sendNotification = true) => {
  try {
    const eventRef = doc(db, "events", eventId);
    
    // Get current event data to check if status is changing
    const currentEventSnap = await getDoc(eventRef);
    const currentEvent = currentEventSnap.exists() ? currentEventSnap.data() : null;
    
    // Update with new timestamp
    const updatedData = {
      ...eventData,
      updatedAt: Timestamp.now()
    };
    
    await updateDoc(eventRef, updatedData);
    
    // Send notification if status changed to approved
    if (sendNotification && 
        currentEvent && 
        currentEvent.status !== "approved" && 
        eventData.status === "approved") {
      await createEventNotification(eventId, eventData.title);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Delete an event
 * @param {string} eventId - The event ID
 * @returns {Promise<Object>} - Success status and any error
 */
export const deleteEvent = async (eventId) => {
  try {
    await deleteDoc(doc(db, "events", eventId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Approve or reject an event
 * @param {string} eventId - The event ID
 * @param {string} status - The new status (approved or rejected)
 * @param {string} reviewerId - The ID of the admin reviewing the event
 * @param {string} reviewNotes - Optional notes from the reviewer
 * @returns {Promise<Object>} - Success status and any error
 */
export const reviewEvent = async (eventId, status, reviewerId, reviewNotes = "") => {
  try {
    const eventRef = doc(db, "events", eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      return { success: false, error: "Event not found" };
    }
    
    const eventData = eventSnap.data();
    
    await updateDoc(eventRef, {
      status,
      reviewerId,
      reviewNotes,
      reviewedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Send notification if approved
    if (status === "approved") {
      await createEventNotification(eventId, eventData.title);
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get events created by a specific user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - Success status, events array, and any error
 */
export const getUserEvents = async (userId) => {
  try {
    const q = query(
      collection(db, "events"),
      where("creatorId", "==", userId),
      orderBy("date", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const events = [];
    
    querySnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data(),
        date: doc.data().date ? new Date(doc.data().date) : null
      });
    });
    
    return { success: true, events };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
