"use client";

import { useEffect, useRef, useState } from 'react';
import Vapi from '@vapi-ai/web';

export interface VapiMessage {
    type: string;
    role?: 'user' | 'assistant' | 'system';
    transcript?: string;
    message?: string;
}

export function useVapi() {
    const vapiRef = useRef<Vapi | null>(null);
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [messages, setMessages] = useState<VapiMessage[]>([]);
    const [volumeLevel, setVolumeLevel] = useState(0);

    useEffect(() => {
        // Initialize Vapi
        const publicKey = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

        if (!publicKey) {
            console.error('VAPI public key not found');
            return;
        }

        vapiRef.current = new Vapi(publicKey);

        // Set up event listeners
        vapiRef.current.on('call-start', () => {
            console.log('Call started');
            setIsSessionActive(true);
        });

        vapiRef.current.on('call-end', () => {
            console.log('Call ended');
            setIsSessionActive(false);
            setIsSpeaking(false);
        });

        vapiRef.current.on('speech-start', () => {
            console.log('Assistant started speaking');
            setIsSpeaking(true);
        });

        vapiRef.current.on('speech-end', () => {
            console.log('Assistant stopped speaking');
            setIsSpeaking(false);
        });

        vapiRef.current.on('message', (message: VapiMessage) => {
            console.log('Message received:', message);
            setMessages((prev) => [...prev, message]);
        });

        vapiRef.current.on('volume-level', (level: number) => {
            setVolumeLevel(level);
        });

        vapiRef.current.on('error', (error: any) => {
            console.error('Vapi error:', error);
        });

        return () => {
            if (vapiRef.current) {
                vapiRef.current.stop();
            }
        };
    }, []);

    const start = async (assistantId?: string) => {
        if (!vapiRef.current) return;

        try {
            // If you have a pre-configured assistant in Vapi dashboard, use assistantId
            if (assistantId) {
                await vapiRef.current.start(assistantId);
            } else {
                // Or configure the assistant inline
                await vapiRef.current.start({
                    model: {
                        provider: 'openai',
                        model: 'gpt-4o-mini',
                        messages: [
                            {
                                role: 'system',
                                content: `You are a professional voice booking assistant for Dr. Smith's clinic.

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
Assistant: "Perfect! I have you booked for Physiotherapy on Monday at 2 PM. You'll receive a confirmation shortly. Is there anything else I can help you with?"`,
                            },
                        ],
                    },
                    voice: {
                        provider: 'openai',
                        voiceId: 'nova', // Friendly, professional voice
                    },
                    name: 'Booking Assistant',
                    firstMessage: "Hello, thanks for calling Dr. Smith's clinic. May I have your full name please?",
                    transcriber: {
                        provider: 'deepgram',
                        model: 'nova-2',
                        language: 'en-US',
                        keywords: ['physiotherapy', 'massage', 'consultation', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    },
                });
            }
        } catch (error) {
            console.error('Failed to start call:', error);
        }
    };

    const stop = () => {
        if (vapiRef.current) {
            vapiRef.current.stop();
        }
    };

    const send = (message: string) => {
        if (vapiRef.current) {
            vapiRef.current.send({
                type: 'add-message',
                message: {
                    role: 'system',
                    content: message,
                },
            });
        }
    };

    const setMuted = (muted: boolean) => {
        if (vapiRef.current) {
            vapiRef.current.setMuted(muted);
        }
    };

    return {
        start,
        stop,
        send,
        setMuted,
        isSessionActive,
        isSpeaking,
        messages,
        volumeLevel,
    };
}
