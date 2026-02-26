# Voice Scheduling Agent

A real-time voice AI assistant that initiates a conversation, collects meeting details (name, date, time, title), confirms the information, and autonomously books a Google Calendar event.

## Deployed Application
- **Agent URL:** [https://voice-scheduling-agent-iota.vercel.app/](https://voice-scheduling-agent-iota.vercel.app/)
- **Demo Video:** [https://www.loom.com/share/ed99913a2de740b197af15c10c3e0394](https://www.loom.com/share/ed99913a2de740b197af15c10c3e0394)

## How to Test the Agent
1. Visit the deployed Agent URL above.
2. Click the microphone/phone icon in the bottom right corner to start the call.
3. Provide a name, a date (e.g., "next Friday"), and a time (e.g., "2 PM"). 
4. Confirm the details when prompted. The agent will trigger the backend and book the event.
5. **Note:** Since the calendar is private, please refer to the **Demo Video** to see the event creation in action.

## Security & Environment
To follow security best practices, the `credentials.json` (Google Service Account Key) and `.env` files have been excluded from this repository via `.gitignore`. 

### Required Local Files
To run this project locally, you must manually create a `credentials.json` file in the `voice-agent-backend/` directory.

**File Template (`credentials.json`):**
Obtain these values from your [Google Cloud Console](https://console.cloud.google.com/):
```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "your-private-key-id",
  "private_key": "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n",
  "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
  "client_id": "your-client-id",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "your-cert-url"
}
