require('dotenv').config();
const express = require('express');
const { google } = require('googleapis');

const app = express();
app.use(express.json());

// 1. Authenticate with Google Calendar
const auth = new google.auth.GoogleAuth({
  keyFile: './credentials.json',
  scopes: ['https://www.googleapis.com/auth/calendar.events'],
});
const calendar = google.calendar({ version: 'v3', auth });
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

// 2. Webhook Endpoint for Vapi
app.post('/api/vapi/webhook', async (req, res) => {
  try {
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    
    const { message } = req.body;

    if (message && message.type === 'tool-calls') {
      const toolCalls = message.toolCalls;
      const toolCallResponses = [];

      for (const toolCall of toolCalls) {
        if (toolCall.function.name === 'create_calendar_event') {
          const params = toolCall.function.arguments;
          
          // DEBUG LOGGING
          console.log('📋 Raw params received:');
          console.log('- Name:', params.name || 'MISSING');
          console.log('- Date:', params.date || 'MISSING');
          console.log('- Time:', params.time || 'MISSING');
          console.log('- Title:', params.title || 'MISSING');

          let eventTitle;
          if (params.title && typeof params.title === 'string' && params.title.trim().length > 0) {
            eventTitle = params.title.trim();
          } else if (params.name && typeof params.name === 'string' && params.name.toLowerCase().includes('meeting with')) {
            eventTitle = params.name.replace(/^(?:Meeting with|meeting with)\s*/i, '').trim();
          } else if (params.name && typeof params.name === 'string') {
            eventTitle = params.name.trim();
          } else {
            eventTitle = 'Scheduled Meeting';
          }

          console.log('🎯 Final event title:', eventTitle);

          // Format DateTimes
          const startDateTime = new Date(`${params.date}T${params.time}:00`);
          const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 min duration

          // Construct the Google Calendar Event
          const event = {
            summary: eventTitle,
            description: `Scheduled via Voice Agent | ${params.name || 'Unknown'} | ${params.title || 'No title provided'}`,
            start: { 
              dateTime: startDateTime.toISOString(), 
              timeZone: 'America/Edmonton' // Calgary MST
            },
            end: { 
              dateTime: endDateTime.toISOString(), 
              timeZone: 'America/Edmonton' 
            },
          };

          console.log('Creating event:', event);

          // Insert the event into the calendar
          const calendarResponse = await calendar.events.insert({
            calendarId: CALENDAR_ID,
            resource: event,
          });

          console.log('Event created:', calendarResponse.data.htmlLink);

          // Return success response to the voice agent
          toolCallResponses.push({
            toolCallId: toolCall.id,
            result: `Successfully scheduled "${eventTitle}". Event created: ${calendarResponse.data.htmlLink}`,
          });
        }
      }
      
      return res.json({ results: toolCallResponses });
    }

    // Default acknowledgment
    console.log('Non-tool event received');
    res.status(200).send('Webhook received');
  } catch (error) {
    console.error('❌ Error handling webhook:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));