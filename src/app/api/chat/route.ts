import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { messages, context } = await request.json();

        // System prompt for the booking agent
        const systemPrompt = `You are a professional voice booking assistant for Dr. Smith's clinic.

CONVERSATION FLOW - Follow this exact order:
1. FIRST: Ask for the caller's full name
2. SECOND: Ask what service they need (Physiotherapy, Massage, or General Consultation)
3. THIRD: Ask what day and time works best for them (Available: Monday-Friday, 9 AM - 5 PM)
4. FOURTH: Confirm all details and let them know the appointment is booked

IMPORTANT RULES:
- Always ask for information in the order above (name → service → time)
- Keep responses brief and natural for voice conversation (1-2 sentences max)
- Don't ask multiple questions at once
- After collecting all three pieces of information, confirm the booking
- Be friendly but professional
- If they provide information out of order, acknowledge it and continue with the next missing piece

Example flow:
Assistant: "Hello, thanks for calling Dr. Smith's clinic. May I have your full name please?"
Caller: "John Smith"
Assistant: "Thank you, John. What service would you like to book today? We offer Physiotherapy, Massage, or General Consultation."
Caller: "Physiotherapy"
Assistant: "Great choice. What day and time works best for you? We're available Monday through Friday, 9 AM to 5 PM."
Caller: "Monday at 2 PM"
Assistant: "Perfect! I have you booked for Physiotherapy on Monday at 2 PM. You'll receive a confirmation shortly. Is there anything else I can help you with?"`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // or 'gpt-3.5-turbo' for faster/cheaper responses
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages,
            ],
            temperature: 0.7,
            max_tokens: 150,
        });

        const assistantMessage = completion.choices[0].message.content;

        return NextResponse.json({
            message: assistantMessage,
            usage: completion.usage,
        });
    } catch (error: any) {
        console.error('OpenAI API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat request', details: error.message },
            { status: 500 }
        );
    }
}
