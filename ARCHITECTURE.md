# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                            │
│                      (Simulator.tsx)                             │
│                                                                   │
│  ┌──────────────────┐              ┌──────────────────┐         │
│  │   Text + LLM     │              │  Voice (Vapi.ai) │         │
│  │      Mode        │              │       Mode       │         │
│  └────────┬─────────┘              └────────┬─────────┘         │
│           │                                 │                    │
└───────────┼─────────────────────────────────┼────────────────────┘
            │                                 │
            │                                 │
            ▼                                 ▼
┌───────────────────────┐         ┌──────────────────────┐
│   Text Input Handler  │         │   Vapi.ai Hook       │
│  (handleSendInput)    │         │   (useVapi.ts)       │
└───────────┬───────────┘         └──────────┬───────────┘
            │                                │
            │                                │
            ▼                                ▼
┌───────────────────────┐         ┌──────────────────────┐
│  LLM Processing       │         │   Vapi.ai Cloud      │
│  (agent-logic.ts)     │         │   - Speech-to-Text   │
│                       │         │   - LLM Processing   │
│  processUserInputWith │         │   - Text-to-Speech   │
│  LLM()                │         │                      │
└───────────┬───────────┘         └──────────────────────┘
            │
            │
            ▼
┌───────────────────────┐
│   API Route           │
│   /api/chat           │
│   (route.ts)          │
│                       │
│   Calls OpenAI API    │
└───────────┬───────────┘
            │
            │
            ▼
┌───────────────────────┐
│   OpenAI GPT API      │
│   - gpt-4o-mini       │
│   - System Prompt     │
│   - Conversation      │
│     History           │
└───────────┬───────────┘
            │
            │
            ▼
┌───────────────────────┐
│   Response Processing │
│   - Intent Detection  │
│   - Action Extraction │
│   - State Management  │
└───────────┬───────────┘
            │
            │
            ▼
┌───────────────────────┐
│   State Store         │
│   (Zustand)           │
│   - Transcript        │
│   - Appointments      │
│   - Call Status       │
└───────────────────────┘
```

## Data Flow

### Text + LLM Mode Flow

1. **User Input** → User types message
2. **Add to History** → Message added to conversation history
3. **API Call** → POST to `/api/chat` with conversation history
4. **OpenAI Processing** → GPT model generates response
5. **Response Handling** → Extract intent and actions
6. **State Update** → Update transcript and appointments
7. **UI Update** → Display agent response

### Voice (Vapi.ai) Mode Flow

1. **Start Call** → Initialize Vapi.ai session
2. **Audio Capture** → Browser captures microphone input
3. **Vapi.ai Processing**:
   - Speech-to-Text (Deepgram)
   - LLM Processing (OpenAI)
   - Text-to-Speech (OpenAI TTS)
4. **Event Handling** → Receive transcripts and events
5. **State Sync** → Update transcript and conversation history
6. **Audio Playback** → Play agent's voice response

## Key Components

### Frontend Components

- **Simulator.tsx**: Main UI component with mode switching
- **LiveTranscript.tsx**: Real-time conversation display
- **Waveform.tsx**: Audio visualization
- **DashboardLayout.tsx**: Overall layout wrapper

### Hooks

- **useVapi.ts**: Vapi.ai integration and event handling
- **useStore.ts**: Zustand state management

### Backend/Logic

- **agent-logic.ts**: Conversation processing and intent detection
- **route.ts**: API endpoint for OpenAI LLM calls

### State Management

- **store.ts**: Global state (Zustand)
  - Call status
  - Transcript messages
  - Appointments
  - Analytics

## Environment Variables

```
NEXT_PUBLIC_VAPI_PUBLIC_KEY  → Used in browser (useVapi.ts)
OPENAI_API_KEY               → Used in API route (route.ts)
VAPI_PRIVATE_KEY             → Optional, for server-side Vapi operations
```

## API Endpoints

### `/api/chat` (POST)
- **Input**: `{ messages: ConversationMessage[], context: any }`
- **Output**: `{ message: string, usage: object }`
- **Purpose**: Process user input with OpenAI LLM

## External Services

1. **OpenAI API**
   - Model: gpt-4o-mini
   - Purpose: Natural language understanding and generation
   - Cost: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens

2. **Vapi.ai**
   - Services: Speech-to-Text, LLM, Text-to-Speech
   - Purpose: End-to-end voice conversation
   - Cost: Per-minute pricing (check Vapi.ai dashboard)

## Security Considerations

- ✅ API keys stored in `.env.local` (not committed to git)
- ✅ OpenAI key only used server-side
- ✅ Vapi public key safe for client-side use
- ⚠️ Rate limiting recommended for production
- ⚠️ User authentication recommended for production
