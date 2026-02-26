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

// 2. Webhook Endpoint for Vapi (4 params: name, date, time, title-optional)
app.post('/api/vapi/webhook', async (req, res) => {
  try {
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    const { message } = req.body;

    if (message && message.type === 'tool-calls') {
      const toolCalls = message.toolCalls;
      const toolCallResponses = [];

      for (const toolCall of toolCalls) {
        if (toolCall.function.name === 'create_calendar_event') {
          const params = toolCall.function.arguments;
          
          // LOG ALL 4 PARAMETERS
          console.log('Parameters:');
          console.log(`  Name: "${params.name || 'MISSING'}"`);
          console.log(`  Date: "${params.date || 'MISSING'}"`);
          console.log(`  Time: "${params.time || 'MISSING'}"`);
          console.log(`  Title: "${params.title || 'NONE'}"`);

          const eventTitle = params.title && params.title.trim() 
            ? params.title.trim() 
            : `Meeting with ${params.name || 'Someone'}`;

          console.log('Event title:', `"${eventTitle}"`);

          // Format DateTimes
          const startDateTime = new Date(`${params.date}T${params.time}:00`);
          const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);

          // Create Event
          const event = {
            summary: eventTitle,
            description: `Voice Agent | ${params.name || 'Unknown'} | ${params.title ? `(${params.title})` : 'No title'}`,
            start: { 
              dateTime: startDateTime.toISOString(), 
              timeZone: 'America/Edmonton' // Calgary
            },
            end: { 
              dateTime: endDateTime.toISOString(), 
              timeZone: 'America/Edmonton' 
            },
          };

          console.log('Inserting event to:', CALENDAR_ID);

          // Insert event
          const calendarResponse = await calendar.events.insert({
            calendarId: CALENDAR_ID,
            resource: event,
          });

          console.log('SUCCESS:', calendarResponse.data.htmlLink);

          toolCallResponses.push({
            toolCallId: toolCall.id,
            result: `"${eventTitle}" scheduled successfully! ${calendarResponse.data.htmlLink}`,
          });
        }
      }
      
      return res.json({ results: toolCallResponses });
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('ERROR:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}`));