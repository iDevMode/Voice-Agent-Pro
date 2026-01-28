# Voice Agent Pro

An AI-powered appointment scheduling system that allows patients to book appointments at Dr. Smith's clinic through natural voice conversations or text chat. The agent handles the entire booking process autonomously, from greeting callers to confirming appointments.

## 🌟 Key Features

### 🎤 **Dual Interaction Modes**

**Voice Mode (Vapi.ai)**
- Real-time voice conversations using Vapi.ai technology
- Natural speech recognition and text-to-speech
- Hands-free booking experience
- Professional voice assistant (Nova voice)

**Text Mode (LLM)**
- Text-based chat interface powered by OpenAI GPT
- Ideal for testing and accessibility
- Same intelligent conversation flow as voice mode

### 🤖 **Intelligent Conversation Flow**

The agent follows a structured, professional conversation pattern:

1. **Greeting** - Welcomes the caller warmly
2. **Name Collection** - Asks for the patient's full name
3. **Service Selection** - Inquires about the desired service (Physiotherapy, Massage, or General Consultation)
4. **Time Scheduling** - Requests preferred day and time (Monday-Friday, 9 AM - 5 PM)
5. **Confirmation** - Confirms all details and books the appointment

### 🧠 **Smart Features**

**Filler Word Filtering**
- Automatically removes "um", "uh", "ah", and other filler words
- Ensures clean, professional data capture
- Example: "Um, John Smith" → "John Smith"

**Duplicate Prevention**
- Prevents multiple appointments from being created for the same booking
- Tracks processed messages to avoid repetition in transcripts
- Ensures data integrity

**Natural Language Understanding**
- Powered by OpenAI's GPT-4o-mini for intelligent responses
- Understands context and maintains conversation flow
- Handles variations in how people speak naturally

### 📅 **Automatic Appointment Management**

**Smart Booking**
- Automatically extracts booking details from conversation
- Creates appointments with correct date, time, and service
- Calculates actual dates from day names (e.g., "Monday" → next Monday's date)

**Real-time Dashboard**
- View all appointments in a clean, organized interface
- Calendar view for visual scheduling
- Appointment list with full details

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API key
- Vapi.ai account and API keys

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/iDevMode/Voice-Agent-Pro.git
   cd Voice-Agent-Pro
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   
   Create a `.env.local` file in the root directory and add your API keys:
   
   ```env
   # Vapi.ai Configuration
   NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here
   
   # OpenAI Configuration (for LLM)
   OPENAI_API_KEY=your_openai_api_key_here
   
   # Optional: Vapi Private Key (for server-side operations)
   VAPI_PRIVATE_KEY=your_vapi_private_key_here
   ```

### Getting API Keys

#### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into `.env.local` as `OPENAI_API_KEY`

#### Vapi.ai API Keys

1. Go to [Vapi.ai](https://vapi.ai/)
2. Sign up for an account
3. Navigate to your dashboard
4. Find your **Public Key** in the settings
5. Copy and paste into `.env.local` as `NEXT_PUBLIC_VAPI_PUBLIC_KEY`
6. (Optional) Copy your **Private Key** as `VAPI_PRIVATE_KEY` for server-side operations

### Running the Application

1. **Development mode**:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. **Production build**:
   ```bash
   npm run build
   npm start
   ```

## 📖 Usage

### Text + LLM Mode

1. Click on "Text + LLM" mode selector
2. Click "Start Demo Call"
3. Type your messages in the input field
4. The AI will respond using OpenAI's GPT model
5. Book appointments by following the conversation flow

### Voice (Vapi.ai) Mode

1. Click on "Voice (Vapi.ai)" mode selector
2. Click "Start Voice Call"
3. **Allow microphone access** when prompted
4. Speak naturally - the AI will listen and respond with voice
5. Use the mute button to toggle your microphone
6. End the call when finished

## 🏗️ Project Structure

```
voice-agent-pro/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts          # OpenAI LLM API endpoint
│   │   ├── demo/                     # Demo page
│   │   ├── page.tsx                  # Main page
│   │   └── layout.tsx                # Root layout
│   ├── components/
│   │   ├── simulator/
│   │   │   ├── Simulator.tsx         # Main simulator component
│   │   │   ├── LiveTranscript.tsx    # Conversation transcript
│   │   │   └── Waveform.tsx          # Audio visualizer
│   │   └── dashboard/
│   │       ├── DashboardLayout.tsx   # Dashboard layout
│   │       ├── AppointmentList.tsx   # Appointment list view
│   │       └── CalendarView.tsx      # Calendar view
│   ├── hooks/
│   │   └── useVapi.ts                # Vapi.ai integration hook
│   ├── lib/
│   │   ├── agent-logic.ts            # LLM conversation logic
│   │   ├── store.ts                  # Zustand state management
│   │   └── utils.ts                  # Utility functions
│   └── styles/
├── .env.local                        # Environment variables (create this)
├── ARCHITECTURE.md                   # System architecture documentation
├── VAPI_CONFIG.md                    # Vapi configuration guide
├── VAPI_FIXES.md                     # Bug fixes documentation
└── package.json
```

## 🛠️ Technology Stack

- **Next.js 16**: React framework with App Router
- **React 19**: Latest React version
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **OpenAI API**: GPT-4o-mini for intelligent conversations
- **Vapi.ai**: Voice AI platform for real-time voice calls
- **Zustand**: Lightweight state management
- **Lucide React**: Icon library
- **date-fns**: Date manipulation library

## ⚙️ Customization

### Changing the LLM Model

Edit `src/app/api/chat/route.ts`:

```typescript
model: 'gpt-4o-mini', // Change to 'gpt-4', 'gpt-3.5-turbo', etc.
```

### Customizing the Voice

Edit `src/hooks/useVapi.ts`:

```typescript
voice: {
  provider: 'openai',
  voiceId: 'nova', // Options: alloy, echo, fable, onyx, nova, shimmer
},
```

### Modifying the System Prompt

Edit the system prompt in both:
- `src/app/api/chat/route.ts` (for text mode)
- `src/hooks/useVapi.ts` (for voice mode)

## 🐛 Troubleshooting

### "Failed to load the app" Error

- Ensure all dependencies are installed: `npm install`
- Check that your `.env.local` file has valid API keys
- Restart the dev server

### Voice Mode Not Working

- Ensure microphone permissions are granted in your browser
- Check that `NEXT_PUBLIC_VAPI_PUBLIC_KEY` is set correctly
- Verify your Vapi.ai account is active and has credits

### LLM Not Responding

- Verify `OPENAI_API_KEY` is valid and has credits
- Check the browser console for API errors
- Ensure the API route is accessible at `/api/chat`

### Appointments Not Being Created

- Check browser console for errors
- Verify the booking confirmation message contains "booked" or "confirmed"
- Ensure all three pieces of info (name, service, time) are mentioned in conversation

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and design
- [VAPI_CONFIG.md](./VAPI_CONFIG.md) - Vapi.ai configuration guide
- [VAPI_FIXES.md](./VAPI_FIXES.md) - Bug fixes and improvements
- [FLOW_UPDATE.md](./FLOW_UPDATE.md) - Conversation flow updates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT

## 💬 Support

For issues or questions:
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Visit [Vapi.ai Documentation](https://docs.vapi.ai/)
- Review [OpenAI API Documentation](https://platform.openai.com/docs)
- Open an issue on GitHub

## 🎯 Key Takeaway

This is not just a voice menu system - it's an intelligent conversational AI that understands context, speaks naturally, and completes the entire booking process just like a human receptionist would, but available 24/7 with zero wait times.

---

**Built with ❤️ using Next.js, OpenAI, and Vapi.ai**
