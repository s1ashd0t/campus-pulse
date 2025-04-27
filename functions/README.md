# Firebase RSVP Email Function

This Firebase Function sends confirmation emails when users RSVP to events. The email includes event details and a Google Calendar integration.

## Features

- **HTTPS Callable Function**: Can be triggered from the client-side application
- **Firestore Trigger**: Automatically sends emails when new RSVPs are created
- **Email Content**:
  - Event Title
  - Date & Time
  - Location
  - Google Calendar "Add to Calendar" link

## Setup Instructions

1. **Configure Email Credentials**:
   - Open `functions/index.js`
   - Replace the placeholder email credentials with your own:
     ```javascript
     const transporter = nodemailer.createTransport({
       service: 'gmail',
       auth: {
         user: 'your-email@gmail.com', // Replace with your email
         pass: 'your-app-password'     // Replace with your app password
       }
     });
     ```
   - For Gmail, you'll need to create an "App Password" in your Google Account settings

2. **Deploy the Function**:
   ```bash
   firebase deploy --only functions
   ```

## Usage

### Client-Side Integration

The function is already integrated with the RSVP service in the application. When a user RSVPs to an event, the function is automatically called.

### Manual Testing

You can manually test the function using the Firebase Console:

1. Go to the Firebase Console > Functions
2. Select the `sendRsvpEmail` function
3. Click "Test function"
4. Provide a JSON payload with `userId` and `eventId`:
   ```json
   {
     "data": {
       "userId": "user-id-here",
       "eventId": "event-id-here"
     }
   }
   ```

## Customization

### Email Template

You can customize the email template in the `sendRsvpConfirmationEmail` function in `functions/index.js`. The template uses HTML for formatting.

### Calendar Integration

The function uses the `ical-generator` library to create calendar events. You can customize the calendar event properties in the `createCalendarLink` function.

## Troubleshooting

- **Email Not Sending**: Check the Firebase Functions logs for error messages
- **Authentication Errors**: Ensure your email credentials are correct and that "Less secure app access" is enabled for your Gmail account, or use an App Password
- **Function Timeout**: If processing large events, consider optimizing the function to avoid timeouts

## Security

- The function verifies user authentication before sending emails
- Only authenticated users can trigger the function
- The function only sends emails to the email address associated with the authenticated user
