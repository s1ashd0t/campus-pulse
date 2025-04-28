const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const ical = require('ical-generator');

admin.initializeApp();

// Load environment variables if .env file exists
try {
  require('dotenv').config();
} catch (error) {
  console.log('No .env file found, using default configuration');
}

// Configure email transporter with environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
});

/**
 * Creates a Google Calendar event link
 * @param {string} title - Event title
 * @param {Date} startDate - Event start date and time
 * @param {Date} endDate - Event end date and time
 * @param {string} location - Event location
 * @param {string} description - Event description
 * @returns {string} - Google Calendar event link as an iCal file
 */
function createCalendarLink(title, startDate, endDate, location, description) {
  const calendar = ical({
    domain: process.env.CALENDAR_DOMAIN || 'campuspulse.com',
    name: process.env.CALENDAR_NAME || 'Campus Pulse Events'
  });

  calendar.createEvent({
    start: startDate,
    end: endDate,
    summary: title,
    description: description,
    location: location,
    url: process.env.CALENDAR_URL || 'https://campuspulse.com'
  });

  return calendar.toString();
}

/**
 * Sends an RSVP confirmation email with event details and calendar link
 * @param {string} email - Recipient email address
 * @param {Object} eventData - Event data including title, date, time, location
 * @returns {Promise<Object>} - Success status and any error
 */
async function sendRsvpConfirmationEmail(email, eventData) {
  try {
    const { title, date, startTime, endTime, location, description } = eventData;
    
    // Parse dates for calendar
    const startDate = new Date(`${date}T${startTime}`);
    const endDate = endTime ? new Date(`${date}T${endTime}`) : new Date(startDate.getTime() + 60 * 60 * 1000); // Default to 1 hour if no end time
    
    // Generate calendar attachment
    const calendarData = createCalendarLink(title, startDate, endDate, location, description || '');
    
    // Format date and time for email
    const formattedDate = startDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const formattedTime = `${startTime}${endTime ? ` - ${endTime}` : ''}`;
    
    // Email content
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'Campus Pulse'} <${process.env.EMAIL_FROM_ADDRESS || 'your-email@gmail.com'}>`,
      to: email,
      subject: `RSVP Confirmed: ${title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h1 style="color: #4a86e8; text-align: center;">Your RSVP is Confirmed!</h1>
          <h2 style="color: #333;">${title}</h2>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
            <p><strong>Date:</strong> ${formattedDate}</p>
            <p><strong>Time:</strong> ${formattedTime}</p>
            <p><strong>Location:</strong> ${location}</p>
            ${description ? `<p><strong>Description:</strong> ${description}</p>` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="data:text/calendar;charset=utf-8,${encodeURIComponent(calendarData)}" download="event.ics" style="background-color: #4a86e8; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Add to Calendar
            </a>
          </div>
          
          <p style="color: #666; text-align: center; font-size: 14px;">
            We look forward to seeing you at the event!
          </p>
        </div>
      `,
      attachments: [
        {
          filename: 'event.ics',
          content: calendarData,
          contentType: 'text/calendar'
        }
      ]
    };
    
    // Send email
    await transporter.sendMail(mailOptions);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * HTTP function triggered when an RSVP is confirmed
 * Sends a confirmation email with event details and calendar link
 */
exports.sendRsvpEmail = functions.https.onCall(async (data, context) => {
  try {
    // Ensure user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated to confirm RSVP.'
      );
    }
    
    const { userId, eventId } = data;
    
    // Get user data to get email
    const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
    if (!userSnapshot.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }
    
    const userData = userSnapshot.data();
    const userEmail = userData.email;
    
    // Get event data
    const eventSnapshot = await admin.firestore().collection('events').doc(eventId).get();
    if (!eventSnapshot.exists) {
      throw new functions.https.HttpsError('not-found', 'Event not found');
    }
    
    const eventData = eventSnapshot.data();
    
    // Send confirmation email
    const result = await sendRsvpConfirmationEmail(userEmail, eventData);
    
    if (!result.success) {
      throw new functions.https.HttpsError('internal', result.error);
    }
    
    // Update RSVP record to mark email as sent
    const rsvpQuery = await admin.firestore()
      .collection('rsvps')
      .where('userId', '==', userId)
      .where('eventId', '==', eventId)
      .limit(1)
      .get();
    
    if (!rsvpQuery.empty) {
      const rsvpDoc = rsvpQuery.docs[0];
      await admin.firestore().collection('rsvps').doc(rsvpDoc.id).update({
        emailSent: true,
        emailSentAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    return { success: true, message: 'RSVP confirmation email sent successfully' };
  } catch (error) {
    console.error('Error in sendRsvpEmail function:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Firestore trigger function that automatically sends an RSVP confirmation email
 * when a new RSVP document is created or updated with status "going"
 */
exports.onRsvpConfirmed = functions.firestore
  .document('rsvps/{rsvpId}')
  .onCreate(async (snapshot, context) => {
    try {
      const rsvpData = snapshot.data();
      const { userId, eventId, status } = rsvpData;
      
      // Only proceed if status is "going"
      if (status !== 'going') {
        return null;
      }
      
      // Get user data to get email
      const userSnapshot = await admin.firestore().collection('users').doc(userId).get();
      if (!userSnapshot.exists) {
        console.error('User not found:', userId);
        return null;
      }
      
      const userData = userSnapshot.data();
      const userEmail = userData.email;
      
      // Get event data
      const eventSnapshot = await admin.firestore().collection('events').doc(eventId).get();
      if (!eventSnapshot.exists) {
        console.error('Event not found:', eventId);
        return null;
      }
      
      const eventData = eventSnapshot.data();
      
      // Send confirmation email
      const result = await sendRsvpConfirmationEmail(userEmail, eventData);
      
      if (result.success) {
        // Update RSVP record to mark email as sent
        await admin.firestore().collection('rsvps').doc(context.params.rsvpId).update({
          emailSent: true,
          emailSentAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        console.log(`RSVP confirmation email sent to ${userEmail} for event: ${eventData.title}`);
      } else {
        console.error('Failed to send RSVP confirmation email:', result.error);
      }
      
      return null;
    } catch (error) {
      console.error('Error in onRsvpConfirmed function:', error);
      return null;
    }
  });
