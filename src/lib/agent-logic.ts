import { Appointment } from "./store";

export type AgentState = 'idle' | 'listening' | 'processing' | 'speaking';

export interface AgentResponse {
    text: string;
    newState?: AgentState;
    action?: 'book' | 'reschedule' | 'cancel' | 'check_availability';
    data?: any;
}

export interface ConversationMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// LLM-powered agent logic
export async function processUserInputWithLLM(
    input: string,
    conversationHistory: ConversationMessage[],
    context: any
): Promise<AgentResponse> {
    try {
        // Call the API route
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    ...conversationHistory,
                    { role: 'user', content: input }
                ],
                context,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to get LLM response');
        }

        const data = await response.json();
        const text = data.message;

        // Detect actions based on LLM response
        const lowerText = text.toLowerCase();
        let action: AgentResponse['action'] = undefined;
        let responseData: any = {};

        // Simple intent detection from LLM response
        if (lowerText.includes('booked') || lowerText.includes('confirmed')) {
            action = 'book';
            responseData = extractBookingData(input, conversationHistory);
        } else if (lowerText.includes('check') && lowerText.includes('availability')) {
            action = 'check_availability';
        }

        // Determine if conversation is ending
        const isEnding = lowerText.includes('goodbye') ||
            lowerText.includes('have a great day') ||
            lowerText.includes('bye');

        return {
            text,
            newState: isEnding ? 'idle' : 'listening',
            action,
            data: responseData,
        };
    } catch (error) {
        console.error('Error processing with LLM:', error);
        // Fallback to simple response
        return {
            text: "I'm having trouble processing that. Could you please repeat?",
            newState: 'listening',
        };
    }
}

// Helper function to extract booking data from conversation
function extractBookingData(input: string, history: ConversationMessage[]): any {
    const data: any = {};

    // Look through conversation history for service, time, and name
    const fullConversation = history.map(m => m.content).join(' ').toLowerCase();

    if (fullConversation.includes('physiotherapy') || fullConversation.includes('physio')) {
        data.service = 'Physiotherapy';
    } else if (fullConversation.includes('massage')) {
        data.service = 'Massage';
    } else if (fullConversation.includes('consultation')) {
        data.service = 'General Consultation';
    }

    // Extract name from recent user messages (simplified)
    const recentUserMessages = history.filter(m => m.role === 'user').slice(-3);
    const possibleName = recentUserMessages.find(m =>
        m.content.split(' ').length <= 3 &&
        m.content.length > 2 &&
        !m.content.toLowerCase().includes('book')
    );

    if (possibleName) {
        data.customerName = possibleName.content;
    }

    return data;
}

// Legacy function for backward compatibility (now uses simple keyword matching)
export function processUserInput(input: string, context: any): AgentResponse {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('book') || lowerInput.includes('appointment') || lowerInput.includes('schedule')) {
        return {
            text: "I can help with that. What service are you looking to book? We offer Physiotherapy, Massage, and General Consultation.",
            newState: 'listening'
        };
    }

    if (lowerInput.includes('physio') || lowerInput.includes('massage') || lowerInput.includes('consultation')) {
        const service = lowerInput.includes('physio') ? 'Physiotherapy' :
            lowerInput.includes('massage') ? 'Massage' : 'General Consultation';
        return {
            text: `Great, a ${service}. What day and time works best for you?`,
            newState: 'listening',
            data: { service }
        };
    }

    if (lowerInput.includes('monday') || lowerInput.includes('tuesday') || lowerInput.includes('morning') || lowerInput.includes('pm') || lowerInput.includes('am')) {
        return {
            text: "Let me check availability... Yes, that slot is open. Can I get your full name to lock that in?",
            newState: 'listening',
            action: 'check_availability'
        };
    }

    if (lowerInput.length > 3 && !lowerInput.includes('thanks')) {
        return {
            text: `Perfect. I have you booked for [Service] on [Time]. You'll receive a confirmation SMS shortly. Is there anything else?`,
            newState: 'listening',
            action: 'book',
            data: { customerName: input }
        };
    }

    if (lowerInput.includes('no') || lowerInput.includes('thanks') || lowerInput.includes('bye')) {
        return {
            text: "You're welcome! Have a great day. Goodbye.",
            newState: 'idle'
        };
    }

    return {
        text: "I didn't quite catch that. Could you repeat it?",
        newState: 'listening'
    };
}
