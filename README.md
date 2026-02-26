# Voice Scheduling Agent

A real-time voice AI assistant that initiates a conversation, collects meeting details (name, date, time, title), confirms the information, and autonomously books a Google Calendar event.

## Deployed Application
- **Agent URL:** https://voice-scheduling-agent-iota.vercel.app/
- **Demo Video:** 

## How to Test the Agent
1. Visit the deployed Agent URL above.
2. Click the microphone/phone icon in the bottom right corner to start the call.
3. The agent will greet you. Respond by saying you'd like to book a meeting.
4. Provide a name, a date (e.g., "next Friday"), and a time (e.g., "2 PM"). You can also provide an optional meeting title.
5. Confirm the details when the agent repeats them back to you.
6. The agent will trigger the backend webhook and confirm the event has been scheduled. 
7. You (the grader) won't see my private calendar, so please refer to the **Demo Video** to see the event appearing in real-time.

## Calendar Integration Explanation
This project uses the **Google Calendar API v3** with a **Service Account** architecture.

1. **Voice Layer (Vapi.ai):** 
   - The user speaks to a Vapi Voice Agent.
   - The agent uses OpenAI GPT-4o to extract structured parameters (`name`, `date`, `time`, `title`) from the conversation.
   - When the user confirms, the agent triggers a custom tool called `create_calendar_event`.

2. **Backend Logic (Node.js/Express):**
   - Vapi sends a POST request webhook to my hosted Node.js server.
   - The server authenticates with Google Cloud using a Service Account JSON key.
   - It parses the natural language date/time into ISO format.
   - It uses `google.calendar().events.insert` to push the event to the primary calendar.

3. **Response Handling:**
   - The Google API returns a confirmation object with an HTML link.
   - My backend sends this success message back to Vapi.
   - The voice agent verbally confirms to the user that the meeting is booked.

## How to Run Locally (Optional)
If you want to run this code on your own machine:

1. **Clone this repository**
   ```bash
   git clone https://github.com/NarencRaghu/Voice-Scheduling-Agent
   cd voice-scheduling-agent
