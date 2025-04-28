import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  where,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

// Fetch all events with optional status filter
export const getAllEvents = async (statusFilter = null) => {
  try {
    let eventsQuery;
    
    if (statusFilter) {
      // If a status filter is provided, only get events with that status
      eventsQuery = query(
        collection(db, "events"), 
        where("status", "==", statusFilter)
      );
    } else {
      // Otherwise get all events
      eventsQuery = collection(db, "events");
    }

    const snapshot = await getDocs(eventsQuery);
    
    // If no events found and this is just for testing, return empty array but success
    if (snapshot.empty) {
      console.log("No events found in database");
      return { 
        success: true, 
        events: [] 
      };
    }
    
    // Convert snapshot to array of event objects
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      success: true,
      events
    };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      success: false,
      error: "Failed to fetch events",
      details: error.message
    };
  }
};

// Create a new event
export const createEvent = async (eventData, userId, isAdmin = false) => {
  try {
    // Set initial status based on user role
    const status = isAdmin ? "approved" : "pending";
    
    const eventRef = await addDoc(collection(db, "events"), {
      ...eventData,
      status,
      createdBy: userId,
      createdAt: serverTimestamp(),
      signedUpUsers: [],
      attended: []
    });
    
    return {
      success: true,
      eventId: eventRef.id
    };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      success: false,
      error: "Failed to create event"
    };
  }
};

// Review (approve/reject) an event
export const reviewEvent = async (eventId, status, adminId, notes = "") => {
  try {
    const eventRef = doc(db, "events", eventId);
    
    await updateDoc(eventRef, {
      status,
      reviewedBy: adminId,
      reviewedAt: serverTimestamp(),
      reviewNotes: notes
    });
    
    return {
      success: true
    };
  } catch (error) {
    console.error("Error reviewing event:", error);
    return {
      success: false,
      error: "Failed to update event status"
    };
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(db, "events", eventId);
    await deleteDoc(eventRef);
    
    return {
      success: true
    };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      error: "Failed to delete event"
    };
  }
};  