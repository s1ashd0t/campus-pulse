/**
 * Test script for the RSVP email function
 * 
 * This script simulates the data that would be passed to the function
 * and calls the email sending logic directly for testing purposes.
 * 
 * Usage:
 * 1. Update the test data below
 * 2. Run with: node test-email.js
 */

// Load environment variables if .env file exists
try {
  require('dotenv').config();
  console.log('Environment variables loaded from .env file');
} catch (error) {
  console.log('No .env file found, using default configuration');
}

const nodemailer = require('nodemailer');
const ical = require('ical-generator');

// Test data - replace with your test values
const testData = {
  email: 'test@example.com',
  eventData: {
    title: 'Test Event',
    date: '2025-05-15',
    startTime: '14:00',
    endTime: '16:00',
    location: 'Campus Center, Room 101',
    description: 'This is a test event description.'
  }
};

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
    
    // Configure email transporter with environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-app-password'
      }
    });
    
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
    
    console.log('Preparing to send email to:', email);
    console.log('Email subject:', mailOptions.subject);
    
    // Uncomment to actually send the email (after updating credentials)
    // await transporter.sendMail(mailOptions);
    // console.log('Email sent successfully!');
    
    console.log('Email would be sent with the following content:');
    console.log('- Subject:', mailOptions.subject);
    console.log('- Calendar event created for:', title);
    console.log('- Start time:', startDate);
    console.log('- End time:', endDate);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

// Run the test
(async () => {
  console.log('Testing RSVP email function...');
  console.log('Test data:', testData);
  
  const result = await sendRsvpConfirmationEmail(testData.email, testData.eventData);
  
  if (result.success) {
    console.log('Test completed successfully!');
  } else {
    console.error('Test failed:', result.error);
  }
})();
