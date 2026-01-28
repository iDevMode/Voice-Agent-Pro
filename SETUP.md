# Quick Setup Guide

## Step 1: Get Your API Keys

### OpenAI API Key
1. Visit https://platform.openai.com/
2. Sign in or create an account
3. Go to "API Keys" section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-...`)

### Vapi.ai Public Key
1. Visit https://vapi.ai/
2. Sign up for an account
3. Go to your Dashboard
4. Find "Public Key" in Settings
5. Copy the key

## Step 2: Configure Environment Variables

Open the `.env.local` file and replace the placeholder values:

```env
# Replace these with your actual keys
NEXT_PUBLIC_VAPI_PUBLIC_KEY=pk_xxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 3: Test the Application

The dev server should already be running. If not:

```bash
npm run dev
```

Then open http://localhost:3000

## Step 4: Try Both Modes

### Test Text + LLM Mode:
1. Click "Text + LLM" button
2. Click "Start Demo Call"
3. Type: "I want to book an appointment"
4. Follow the conversation

### Test Voice Mode:
1. Click "Voice (Vapi.ai)" button
2. Click "Start Voice Call"
3. Allow microphone access
4. Speak: "I want to book an appointment"
5. Have a natural conversation

## Important Notes

- **OpenAI Costs**: Each LLM request costs a small amount. Monitor your usage at https://platform.openai.com/usage
- **Vapi.ai Credits**: Voice calls consume credits. Check your balance in the Vapi dashboard
- **Microphone Access**: Voice mode requires browser microphone permissions
- **HTTPS**: For production, Vapi.ai requires HTTPS for microphone access

## Next Steps

- Customize the system prompt in `src/app/api/chat/route.ts`
- Modify the voice settings in `src/hooks/useVapi.ts`
- Add more booking logic in `src/lib/agent-logic.ts`
- Style the UI in the component files

## Need Help?

Check the main README.md for detailed documentation and troubleshooting.
