# Voice Booking Agent Showcase

A Next.js application demonstrating an AI-powered voice booking agent with both text (LLM) and voice (Vapi.ai) interaction modes.

## Features

- 🤖 **LLM-Powered Chat**: Intelligent conversation using OpenAI's GPT models
- 🎤 **Voice Integration**: Real-time voice calls powered by Vapi.ai
- 💬 **Dual Mode**: Switch between text-based and voice-based interactions
- 📊 **Live Transcript**: Real-time conversation display
- 📅 **Appointment Booking**: Automated booking system for clinic services
- 🎨 **Modern UI**: Beautiful, responsive interface with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API key
- Vapi.ai account and API keys

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   
   Copy the `.env.local` file and add your API keys:
   
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

## Usage

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

## Project Structure

```
voice-booking-agent-showcase/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts          # OpenAI LLM API endpoint
│   │   ├── page.tsx                  # Main page
│   │   └── layout.tsx                # Root layout
│   ├── components/
│   │   ├── simulator/
│   │   │   ├── Simulator.tsx         # Main simulator component
│   │   │   ├── LiveTranscript.tsx    # Conversation transcript
│   │   │   └── Waveform.tsx          # Audio visualizer
│   │   └── dashboard/
│   │       └── DashboardLayout.tsx   # Dashboard layout
│   ├── hooks/
│   │   └── useVapi.ts                # Vapi.ai integration hook
│   ├── lib/
│   │   ├── agent-logic.ts            # LLM conversation logic
│   │   ├── store.ts                  # Zustand state management
│   │   └── utils.ts                  # Utility functions
│   └── styles/
├── .env.local                        # Environment variables (create this)
└── package.json
```

## Key Technologies

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **OpenAI API**: LLM for intelligent conversations
- **Vapi.ai**: Voice AI platform for real-time voice calls
- **Zustand**: Lightweight state management
- **Lucide React**: Icon library

## Customization

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
  voiceId: 'alloy', // Options: alloy, echo, fable, onyx, nova, shimmer
},
```

### Modifying the System Prompt

Edit the system prompt in both:
- `src/app/api/chat/route.ts` (for text mode)
- `src/hooks/useVapi.ts` (for voice mode)

## Troubleshooting

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

## License

MIT

## Support

For issues or questions:
- Check the [Next.js Documentation](https://nextjs.org/docs)
- Visit [Vapi.ai Documentation](https://docs.vapi.ai/)
- Review [OpenAI API Documentation](https://platform.openai.com/docs)
