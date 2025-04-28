import { createNotification, createEventNotification, createPointsNotification, createAdminNotification, updateNotification } from './notificationService';

/**
 * Creates a test notification for the current user
 * @param {string} userId - The user ID to create the notification for
 * @returns {Promise<Object>} - Success status and any error
 */
export const createTestNotification = async (userId) => {
  try {
    // Create a basic test notification
    const result = await createNotification(
      userId,
      'test',
      '🧪 This is a test notification',
      null
    );
    
    return result;
  } catch (error) {
    console.error('Error creating test notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Creates an event test notification
 * @param {string} userId - The user ID to create the notification for
 * @returns {Promise<Object>} - Success status and any error
 */
export const createEventTestNotification = async (userId) => {
  try {
    return await createNotification(
      userId,
      'event',
      '🎉 New Event: Tech Meetup this Friday!',
      'test-event-id'
    );
  } catch (error) {
    console.error('Error creating event notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Creates an RSVP test notification
 * @param {string} userId - The user ID to create the notification for
 * @returns {Promise<Object>} - Success status and any error
 */
export const createRsvpTestNotification = async (userId) => {
  try {
    return await createNotification(
      userId,
      'rsvp',
      '✅ Your RSVP for Career Development Seminar is confirmed',
      'test-event-id'
    );
  } catch (error) {
    console.error('Error creating RSVP notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Creates a points test notification
 * @param {string} userId - The user ID to create the notification for
 * @returns {Promise<Object>} - Success status and any error
 */
export const createPointsTestNotification = async (userId) => {
  try {
    return await createPointsNotification(
      userId,
      50,
      'attending the workshop'
    );
  } catch (error) {
    console.error('Error creating points notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Creates an admin test notification
 * @param {string} userId - The user ID to create the notification for
 * @returns {Promise<Object>} - Success status and any error
 */
export const createAdminTestNotification = async (userId) => {
  try {
    return await createAdminNotification(
      userId,
      '📢 Important: Campus closure this weekend due to maintenance'
    );
  } catch (error) {
    console.error('Error creating admin notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Creates an important test notification
 * @param {string} userId - The user ID to create the notification for
 * @returns {Promise<Object>} - Success status and any error
 */
export const createImportantTestNotification = async (userId) => {
  try {
    // First create a notification
    const result = await createNotification(
      userId,
      'admin',
      '⭐ This is an important notification that should be starred',
      null
    );
    
    if (result.success && result.notificationId) {
      // Then mark it as important
      await updateNotification(result.notificationId, { important: true });
    }
    
    return result;
  } catch (error) {
    console.error('Error creating important notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Creates multiple test notifications of different types
 * @param {string} userId - The user ID to create notifications for
 * @returns {Promise<Object>} - Success status and any error
 */
export const createMultipleTestNotifications = async (userId) => {
  try {
    const promises = [
      // Event notification
      createEventTestNotification(userId),
      
      // RSVP notification
      createRsvpTestNotification(userId),
      
      // Points notification
      createPointsTestNotification(userId),
      
      // Admin notification
      createAdminTestNotification(userId)
    ];
    
    await Promise.all(promises);
    
    return { success: true, message: 'Created multiple test notifications' };
  } catch (error) {
    console.error('Error creating test notifications:', error);
    return { success: false, error: error.message };
  }
};
