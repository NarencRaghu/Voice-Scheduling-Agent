# Voice Scheduling Agent

A real-time voice AI assistant that initiates a natural conversation, collects meeting details (name, date, time, title), confirms the information with the user, and autonomously books a Google Calendar event.

## Deployed Application & Demo

- **Live Agent URL:** [https://voice-scheduling-agent-iota.vercel.app/](https://voice-scheduling-agent-iota.vercel.app/)
- **Demo Video:** [https://www.loom.com/share/ed99913a2de740b197af15c10c3e0394](https://www.loom.com/share/ed99913a2de740b197af15c10c3e0394)

## How to Test the Agent

1. Visit the **Live Agent URL** linked above.
2. Click the microphone/phone icon in the bottom right corner to start the call.
3. Speak naturally. Provide a name, a date (e.g., "next Friday"), and a time (e.g., "2 PM").
4. Confirm the details when the agent prompts you. 
5. The agent will trigger the backend workflow and book the event.

*Note: Because the target Google Calendar is private, please refer to the **Demo Video** to see the real-time event creation on the calendar.*

---

## Calendar Integration Overview

This agent leverages the Google Calendar API via a Google Service Account to handle scheduling autonomously:
1. **Extraction:** The voice agent uses the LLM's function-calling capabilities to extract the `name`, `date`, `time`, and `title` from the natural language conversation.
2. **Execution:** Upon verbal confirmation from the user, the agent triggers a backend function.
3. **Integration:** The backend parses the natural language datetime into an ISO 8601 format, authenticates using a secure Service Account (`credentials.json`), and pushes the event payload directly to the designated Google Calendar.

---

## Local Development Guide

To adhere to security best practices, sensitive files such as the Google Service Account Key (`credentials.json`) and environment variables (`.env`) have been excluded from this repository. 

To run this project locally, please follow these step-by-step instructions.

### 1. Clone and Install Dependencies

First, clone the repository and install the required packages:

```bash
git clone https://github.com/NarencRaghu/Voice-Scheduling-Agent.git
cd Voice-Scheduling-Agent

# Install the necessary dependencies
npm install 
```

### 2. Configure Environment Variables

Create a new file named `.env` in the root of your project directory. Add your required API keys and configuration settings:

```env
# Add your specific API keys below
VAPI_API_KEY=your_voice_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
CALENDAR_ID=your_target_google_calendar_id@group.calendar.google.com
PORT=3000
```

### 3. Setup Google Calendar Credentials

To allow the application to write to a Google Calendar, you must provide Service Account credentials. 

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and generate a Service Account Key (JSON format).
2. Create a file named `credentials.json` in your project's backend directory.
3. Paste the downloaded JSON data into this file. It should look like this:

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
```

> **CRITICAL STEP:** A Service Account cannot automatically access your personal calendar. You must open your Google Calendar settings, select the specific calendar you want to use, click **"Share with specific people"**, and add the `client_email` address from your `credentials.json` file. Ensure you grant it **"Make changes to events"** permissions.

### 4. Start the Application

Once your dependencies are installed and your `.env` and `credentials.json` files are in place, you can start the local development server:

```bash
# Start the local server
npm run dev
```
