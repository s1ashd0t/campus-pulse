# Firebase RSVP Email Function Overview

## Introduction

This Firebase Function is designed to send confirmation emails when users RSVP to events in the Campus Pulse application. The function is triggered via HTTPS calls when an RSVP is confirmed and sends an email containing:

1. Event Title
2. Date & Time
3. Location
4. Google Calendar "Add to Calendar" link

## Architecture

The implementation consists of two main components:

1. **Firebase Cloud Functions**: Server-side code that runs in response to events
2. **Client Integration**: Updates to the existing RSVP service to call the function

### Firebase Cloud Functions

Two functions are implemented:

1. **`sendRsvpEmail`** (HTTPS Callable): Manually triggered from the client-side
2. **`onRsvpConfirmed`** (Firestore Trigger): Automatically triggered when a new RSVP document is created

Both functions retrieve the necessary user and event data from Firestore, generate an email with event details and a calendar attachment, and send it to the user's email address.

### Client Integration

The client-side integration involves:

1. Updating the `rsvpService.js` to call the Firebase Function when an RSVP is confirmed
2. Updating the Firebase configuration to initialize Firebase Functions

## Implementation Details

### Email Content

The email includes:

- A confirmation header
- Event title
- Formatted date and time
- Location
- Event description (if available)
- "Add to Calendar" button that downloads an iCal file
- A closing message

### Google Calendar Integration

The function uses the `ical-generator` library to create an iCal file that can be imported into Google Calendar or other calendar applications. The iCal file includes:

- Event title
- Start and end times
- Location
- Description
- URL to the Campus Pulse website

### Security

The function includes several security measures:

- Authentication check: Only authenticated users can trigger the function
- Data validation: Ensures all required data is present before sending the email
- Error handling: Comprehensive error handling and logging

### Environment Variables

The function uses environment variables for configuration, allowing for easy customization without modifying the code:

- Email credentials
- Email template settings
- Calendar settings

## Workflow

1. User confirms RSVP in the application
2. Client-side code calls the Firebase Function
3. Function retrieves user and event data from Firestore
4. Function generates an email with event details and calendar attachment
5. Email is sent to the user's email address
6. RSVP record is updated to mark the email as sent

## Testing

A test script (`test-email.js`) is provided to test the email sending functionality locally. This script simulates the data that would be passed to the function and calls the email sending logic directly.

## Deployment

The function can be deployed using the Firebase CLI:

```bash
firebase deploy --only functions
```

## Configuration

Configuration is done through environment variables, which can be set in the Firebase Console or in a local `.env` file for development.

## Conclusion

This Firebase Function provides a seamless way to send confirmation emails with calendar integration when users RSVP to events. It enhances the user experience by providing important event information and making it easy to add the event to their calendar.
