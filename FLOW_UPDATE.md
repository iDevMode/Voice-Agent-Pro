# Vapi.ai Flow Update Summary

## Changes Made

### 1. **Updated Conversation Flow**

Both Text (LLM) and Voice (Vapi.ai) modes now follow this exact sequence:

1. **FIRST**: Ask for the caller's full name
2. **SECOND**: Ask what service they need (Physiotherapy, Massage, or General Consultation)
3. **THIRD**: Ask what day and time works best (Monday-Friday, 9 AM - 5 PM)
4. **FOURTH**: Confirm all details and inform them the appointment is booked

### 2. **Updated Files**

#### `src/hooks/useVapi.ts`
- ✅ Updated system prompt with structured conversation flow
- ✅ Changed first message to ask for name immediately
- ✅ Changed voice from 'alloy' to 'nova' (more friendly/professional)
- ✅ Added keywords for better speech recognition

#### `src/app/api/chat/route.ts`
- ✅ Updated system prompt to match Vapi flow exactly
- ✅ Added detailed conversation flow instructions
- ✅ Included example conversation for consistency

#### `src/components/simulator/Simulator.tsx`
- ✅ Updated initial greeting for text mode to ask for name first
- ✅ Added `extractBookingFromHistory()` helper function
- ✅ **Automatic appointment detection** for voice mode
- ✅ **Automatic appointment detection** for text mode
- ✅ Appointments now automatically added to schedule when booking is confirmed

### 3. **Automatic Appointment Booking**

The system now **automatically detects** when a booking is confirmed and adds it to the appointment schedule.

**Detection triggers:**
- When assistant says "booked", "confirmed", or "perfect...appointment"
- Extracts name, service, and time from conversation history
- Adds appointment to the schedule automatically

**What gets extracted:**
- **Name**: First user message that's 1-3 words and not a booking keyword
- **Service**: Physiotherapy, Massage, or General Consultation
- **Time**: Day (Monday-Friday) and time (e.g., "2 PM")

### 4. **How It Works**

#### Voice Mode (Vapi.ai):
1. User starts voice call
2. Vapi asks: "May I have your full name please?"
3. User responds with name
4. Vapi asks: "What service would you like to book?"
5. User responds with service
6. Vapi asks: "What day and time works best?"
7. User responds with time
8. Vapi confirms: "Perfect! I have you booked..."
9. **Appointment automatically added to schedule** ✅

#### Text Mode (LLM):
1. User starts demo call
2. LLM asks: "May I have your full name please?"
3. User types name
4. LLM asks: "What service would you like to book?"
5. User types service
6. LLM asks: "What day and time works best?"
7. User types time
8. LLM confirms: "Perfect! I have you booked..."
9. **Appointment automatically added to schedule** ✅

### 5. **Testing the Changes**

#### Test Voice Mode:
```
1. Click "Voice (Vapi.ai)" button
2. Click "Start Voice Call"
3. Allow microphone access
4. Say: "John Smith"
5. Say: "Physiotherapy"
6. Say: "Monday at 2 PM"
7. Check the Dashboard - appointment should appear!
```

#### Test Text Mode:
```
1. Click "Text + LLM" button
2. Click "Start Demo Call"
3. Type: "John Smith"
4. Type: "Physiotherapy"
5. Type: "Monday at 2 PM"
6. Check the Dashboard - appointment should appear!
```

### 6. **Viewing Appointments**

To see the booked appointments:
1. Navigate to the Dashboard page
2. Look for the appointments list
3. You should see entries with:
   - Customer name
   - Service type
   - Date/time
   - Status: "confirmed"

### 7. **Console Logging**

For debugging, appointments are logged to the browser console:
- Open Developer Tools (F12)
- Check Console tab
- Look for: `"Appointment added:"` or `"Appointment added (text mode):"`

## Key Improvements

✅ **Structured conversation flow** - No more random question order
✅ **Consistent experience** - Same flow in both text and voice modes
✅ **Automatic booking** - No manual intervention needed
✅ **Smart extraction** - Intelligently parses conversation for booking details
✅ **Better voice** - Nova voice is more friendly and professional
✅ **Improved recognition** - Added keywords for better speech-to-text

## Next Steps

1. **Test both modes** to verify the flow works correctly
2. **Check the Dashboard** to see appointments appearing
3. **Customize the voice** if you prefer a different one (see VAPI_CONFIG.md)
4. **Adjust the system prompt** if you want different wording

## Troubleshooting

**If appointments don't appear:**
- Check browser console for errors
- Verify the booking confirmation message contains "booked" or "confirmed"
- Ensure all three pieces of info (name, service, time) are mentioned in conversation

**If voice mode doesn't work:**
- Verify Vapi.ai API key is correct
- Check microphone permissions
- Refresh the page and try again

## Files Modified

1. `src/hooks/useVapi.ts` - Vapi configuration
2. `src/app/api/chat/route.ts` - OpenAI system prompt
3. `src/components/simulator/Simulator.tsx` - Booking detection logic

---

**Ready to test!** Open http://localhost:3000 and try booking an appointment in both modes.
