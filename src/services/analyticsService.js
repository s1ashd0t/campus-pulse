import { collection, query, where, getDocs, getDoc, doc, orderBy, limit, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Get event attendance statistics
 * @returns {Promise<Object>} - Success status, statistics, and any error
 */
export const getEventAttendanceStats = async () => {
  try {
    // Get all events
    const eventsQuery = query(
      collection(db, "events"),
      where("status", "==", "approved")
    );
    
    const eventsSnapshot = await getDocs(eventsQuery);
    const events = [];
    
    eventsSnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Get RSVP counts for each event
    const eventStats = await Promise.all(events.map(async (event) => {
      const rsvpQuery = query(
        collection(db, "rsvps"),
        where("eventId", "==", event.id)
      );
      
      const rsvpSnapshot = await getDocs(rsvpQuery);
      
      const going = rsvpSnapshot.docs.filter(doc => doc.data().status === "going").length;
      const maybe = rsvpSnapshot.docs.filter(doc => doc.data().status === "maybe").length;
      const notGoing = rsvpSnapshot.docs.filter(doc => doc.data().status === "not-going").length;
      
      return {
        eventId: event.id,
        title: event.title,
        date: event.dateTime || event.date,
        category: event.category,
        going,
        maybe,
        notGoing,
        total: going + maybe + notGoing
      };
    }));
    
    return { success: true, eventStats };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get user engagement statistics
 * @returns {Promise<Object>} - Success status, statistics, and any error
 */
export const getUserEngagementStats = async () => {
  try {
    // Get all users
    const usersQuery = query(
      collection(db, "users")
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    const users = [];
    
    usersSnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Get RSVP counts for each user
    const userStats = await Promise.all(users.map(async (user) => {
      const rsvpQuery = query(
        collection(db, "rsvps"),
        where("userId", "==", user.id)
      );
      
      const rsvpSnapshot = await getDocs(rsvpQuery);
      
      return {
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role || "student",
        rsvpCount: rsvpSnapshot.docs.length,
        goingCount: rsvpSnapshot.docs.filter(doc => doc.data().status === "going").length
      };
    }));
    
    return { success: true, userStats };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get points distribution statistics
 * @returns {Promise<Object>} - Success status, statistics, and any error
 */
export const getPointsDistributionStats = async () => {
  try {
    // Get all users with their points
    const usersQuery = query(
      collection(db, "users")
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    const userPoints = [];
    
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      userPoints.push({
        userId: doc.id,
        name: `${userData.firstName} ${userData.lastName}`,
        points: userData.points || 0
      });
    });
    
    // Calculate points distribution
    const totalUsers = userPoints.length;
    const totalPoints = userPoints.reduce((sum, user) => sum + user.points, 0);
    const averagePoints = totalUsers > 0 ? totalPoints / totalUsers : 0;
    const maxPoints = userPoints.length > 0 ? Math.max(...userPoints.map(user => user.points)) : 0;
    const minPoints = userPoints.length > 0 ? Math.min(...userPoints.map(user => user.points)) : 0;
    
    // Group users by point ranges
    const pointRanges = [
      { range: "0-50", count: 0 },
      { range: "51-100", count: 0 },
      { range: "101-200", count: 0 },
      { range: "201-500", count: 0 },
      { range: "501+", count: 0 }
    ];
    
    userPoints.forEach(user => {
      if (user.points <= 50) {
        pointRanges[0].count++;
      } else if (user.points <= 100) {
        pointRanges[1].count++;
      } else if (user.points <= 200) {
        pointRanges[2].count++;
      } else if (user.points <= 500) {
        pointRanges[3].count++;
      } else {
        pointRanges[4].count++;
      }
    });
    
    // Get top users by points
    const topUsers = [...userPoints]
      .sort((a, b) => b.points - a.points)
      .slice(0, 10);
    
    return { 
      success: true, 
      pointsStats: {
        totalUsers,
        totalPoints,
        averagePoints,
        maxPoints,
        minPoints,
        pointRanges,
        topUsers
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get event category statistics
 * @returns {Promise<Object>} - Success status, statistics, and any error
 */
export const getEventCategoryStats = async () => {
  try {
    // Get all approved events
    const eventsQuery = query(
      collection(db, "events"),
      where("status", "==", "approved")
    );
    
    const eventsSnapshot = await getDocs(eventsQuery);
    const events = [];
    
    eventsSnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Count events by category
    const categories = {};
    
    events.forEach(event => {
      const category = event.category || "other";
      if (categories[category]) {
        categories[category]++;
      } else {
        categories[category] = 1;
      }
    });
    
    // Format for chart.js
    const categoryStats = {
      labels: Object.keys(categories),
      data: Object.values(categories)
    };
    
    return { success: true, categoryStats };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get monthly event statistics
 * @param {number} months - Number of months to include
 * @returns {Promise<Object>} - Success status, statistics, and any error
 */
export const getMonthlyEventStats = async (months = 6) => {
  try {
    // Get current date and date X months ago
    const now = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    
    // Get all approved events in date range
    const eventsQuery = query(
      collection(db, "events"),
      where("status", "==", "approved"),
      where("dateTime", ">=", startDate),
      where("dateTime", "<=", now),
      orderBy("dateTime", "asc")
    );
    
    const eventsSnapshot = await getDocs(eventsQuery);
    const events = [];
    
    eventsSnapshot.forEach((doc) => {
      events.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Group events by month
    const monthlyData = {};
    
    for (let i = 0; i < months; i++) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthKey = `${monthDate.getFullYear()}-${monthDate.getMonth() + 1}`;
      const monthName = monthDate.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      monthlyData[monthKey] = {
        name: monthName,
        count: 0,
        rsvps: 0
      };
    }
    
    // Count events and RSVPs by month
    await Promise.all(events.map(async (event) => {
      const eventDate = new Date(event.dateTime);
      const monthKey = `${eventDate.getFullYear()}-${eventDate.getMonth() + 1}`;
      
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].count++;
        
        // Get RSVP count for this event
        const rsvpQuery = query(
          collection(db, "rsvps"),
          where("eventId", "==", event.id),
          where("status", "==", "going")
        );
        
        const rsvpSnapshot = await getDocs(rsvpQuery);
        monthlyData[monthKey].rsvps += rsvpSnapshot.docs.length;
      }
    }));
    
    // Format for chart.js
    const monthlyStats = {
      labels: Object.values(monthlyData).map(m => m.name).reverse(),
      eventCounts: Object.values(monthlyData).map(m => m.count).reverse(),
      rsvpCounts: Object.values(monthlyData).map(m => m.rsvps).reverse()
    };
    
    return { success: true, monthlyStats };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
