require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');

const app = express();
app.use(express.json());

// 1. Authenticate with Google Calendar
// 1. Authenticate with Google Calendar
const auth = new google.auth.GoogleAuth({
    keyFile: './credentials.json', // Points directly to your file
    scopes: ['https://www.googleapis.com/auth/calendar.events'],
  });  
const calendar = google.calendar({ version: 'v3', auth });
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

// 2. Webhook Endpoint for Vapi
app.post('/api/vapi/webhook', async (req, res) => {
  try {
    const { message } = req.body;

    // Check if the event is a tool call from the agent
    if (message && message.type === 'tool-calls') {
      const toolCalls = message.toolCalls;
      const toolCallResponses = [];

      for (const toolCall of toolCalls) {
        if (toolCall.function.name === 'create_calendar_event') {
          const params = toolCall.function.arguments; // Includes name, date, time, title
          
          // Format DateTimes
          const startDateTime = new Date(`${params.date}T${params.time}:00`);
          const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 min duration

          // Construct the Google Calendar Event
          const event = {
            summary: params.title || `Meeting with ${params.name}`,
            description: `Scheduled via Voice Agent for ${params.name}`,
            start: { dateTime: startDateTime.toISOString(), timeZone: 'America/New_York' },
            end: { dateTime: endDateTime.toISOString(), timeZone: 'America/New_York' },
          };

          // Insert the event into the calendar
          const calendarResponse = await calendar.events.insert({
            calendarId: CALENDAR_ID,
            resource: event,
          });

          // Return success response to the voice agent
          toolCallResponses.push({
            toolCallId: toolCall.id,
            result: `Successfully scheduled the meeting. Event Link: ${calendarResponse.data.htmlLink}`,
          });
        }
      }
      
      return res.json({ results: toolCallResponses });
    }

    // Default acknowledgment for non-tool events (like call-started)
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));