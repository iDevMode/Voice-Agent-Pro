# Vapi.ai Configuration Examples

This document provides example configurations for your Vapi.ai assistant.

## Option 1: Inline Configuration (Current Implementation)

The current implementation in `src/hooks/useVapi.ts` uses inline configuration:

```typescript
await vapiRef.current.start({
  model: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Your system prompt here...`,
      },
    ],
  },
  voice: {
    provider: 'openai',
    voiceId: 'alloy',
  },
  name: 'Booking Assistant',
  firstMessage: "Hello, thanks for calling...",
  transcriber: {
    provider: 'deepgram',
    model: 'nova-2',
    language: 'en-US',
  },
});
```

## Option 2: Pre-configured Assistant (Recommended for Production)

Create an assistant in the Vapi.ai dashboard and use its ID:

```typescript
// In useVapi.ts
const start = async (assistantId?: string) => {
  if (!vapiRef.current) return;
  
  // Use pre-configured assistant
  await vapiRef.current.start('your-assistant-id-here');
};
```

## Voice Options

### OpenAI Voices
```typescript
voice: {
  provider: 'openai',
  voiceId: 'alloy',  // Options: alloy, echo, fable, onyx, nova, shimmer
}
```

**Voice Characteristics:**
- `alloy`: Neutral, balanced
- `echo`: Clear, professional
- `fable`: Warm, friendly
- `onyx`: Deep, authoritative
- `nova`: Energetic, youthful
- `shimmer`: Soft, gentle

### ElevenLabs Voices (Premium)
```typescript
voice: {
  provider: 'elevenlabs',
  voiceId: 'your-elevenlabs-voice-id',
}
```

## Transcriber Options

### Deepgram (Recommended)
```typescript
transcriber: {
  provider: 'deepgram',
  model: 'nova-2',        // Latest, most accurate
  language: 'en-US',
  keywords: ['physiotherapy', 'massage', 'consultation'],  // Boost recognition
}
```

### AssemblyAI
```typescript
transcriber: {
  provider: 'assemblyai',
  language: 'en-US',
}
```

## Model Options

### OpenAI Models
```typescript
model: {
  provider: 'openai',
  model: 'gpt-4o-mini',     // Fast, cost-effective
  // model: 'gpt-4o',       // More capable, slower
  // model: 'gpt-3.5-turbo', // Fastest, cheapest
  temperature: 0.7,
  maxTokens: 150,
}
```

### Anthropic Claude
```typescript
model: {
  provider: 'anthropic',
  model: 'claude-3-haiku-20240307',  // Fast
  // model: 'claude-3-sonnet-20240229', // Balanced
  temperature: 0.7,
}
```

## Advanced Configuration

### With Function Calling
```typescript
{
  model: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    functions: [
      {
        name: 'book_appointment',
        description: 'Books an appointment for the customer',
        parameters: {
          type: 'object',
          properties: {
            service: {
              type: 'string',
              enum: ['Physiotherapy', 'Massage', 'General Consultation'],
            },
            date: { type: 'string' },
            time: { type: 'string' },
            customerName: { type: 'string' },
          },
          required: ['service', 'date', 'time', 'customerName'],
        },
      },
    ],
  },
  // ... other config
}
```

### With Background Sound
```typescript
{
  backgroundSound: 'office',  // Options: office, cafe, none
  // ... other config
}
```

### With Recording
```typescript
{
  recordingEnabled: true,
  // ... other config
}
```

### With End-of-Speech Detection
```typescript
{
  endOfSpeechSensitivity: 0.5,  // 0-1, lower = more sensitive
  // ... other config
}
```

## System Prompt Examples

### Booking Assistant (Current)
```
You are a helpful voice booking assistant for Dr. Smith's clinic. 
Your role is to help callers book, reschedule, or cancel appointments.
Available services: Physiotherapy, Massage, and General Consultation.
Keep responses brief and conversational for voice interaction.
Available time slots: Monday-Friday, 9 AM - 5 PM.
```

### Customer Service
```
You are a friendly customer service representative.
Be empathetic, patient, and solution-oriented.
Always confirm understanding before taking action.
If you don't know something, offer to transfer to a human agent.
```

### Sales Assistant
```
You are an enthusiastic sales assistant.
Ask qualifying questions to understand customer needs.
Highlight benefits, not just features.
Use a consultative approach, don't be pushy.
```

## Event Handling

Available events you can listen to:

```typescript
vapi.on('call-start', () => {});
vapi.on('call-end', () => {});
vapi.on('speech-start', () => {});
vapi.on('speech-end', () => {});
vapi.on('message', (message) => {});
vapi.on('volume-level', (level) => {});
vapi.on('error', (error) => {});
vapi.on('function-call', (functionCall) => {});
```

## Cost Optimization Tips

1. **Use gpt-4o-mini** instead of gpt-4 for most use cases
2. **Set maxTokens** to limit response length
3. **Use Deepgram nova-2** for accurate, cost-effective transcription
4. **Enable end-of-speech detection** to reduce latency
5. **Pre-configure assistants** in dashboard to avoid inline config overhead

## Testing Configuration

Test your configuration with:

```bash
# In browser console
console.log('Vapi session active:', isSessionActive);
console.log('Current messages:', messages);
```

## Production Checklist

- [ ] Create assistant in Vapi.ai dashboard
- [ ] Test with different voices
- [ ] Optimize system prompt for your use case
- [ ] Set appropriate maxTokens limit
- [ ] Enable recording for quality assurance
- [ ] Test end-of-speech sensitivity
- [ ] Monitor costs in Vapi dashboard
- [ ] Set up error handling and fallbacks

## Resources

- [Vapi.ai Documentation](https://docs.vapi.ai/)
- [OpenAI Voice Options](https://platform.openai.com/docs/guides/text-to-speech)
- [Deepgram Models](https://developers.deepgram.com/docs/models-overview)
