"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, Mic, MicOff, X, MessageSquare, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { processUserInput, processUserInputWithLLM, ConversationMessage } from "@/lib/agent-logic";
import { useVapi } from "@/hooks/useVapi";
import LiveTranscript from "./LiveTranscript";
import Waveform from "./Waveform";

type InteractionMode = 'text' | 'voice';

// Helper function to extract booking details from conversation history
function extractBookingFromHistory(history: ConversationMessage[]): { name: string; service: string; time: string } {
    let name = '';
    let service = '';
    let time = '';

    // Join all messages to analyze
    const allText = history.map(m => m.content).join(' ').toLowerCase();

    // Extract service
    if (allText.includes('physiotherapy') || allText.includes('physio')) {
        service = 'Physiotherapy';
    } else if (allText.includes('massage')) {
        service = 'Massage';
    } else if (allText.includes('consultation')) {
        service = 'General Consultation';
    }

    // Extract name - look for user messages that might be names
    // (short messages that aren't about services or times)
    const fillerWords = ['um', 'uh', 'ah', 'er', 'hmm', 'like', 'you know', 'well', 'so', 'yeah', 'yes', 'no'];
    const userMessages = history.filter(m => m.role === 'user');

    for (const msg of userMessages) {
        let content = msg.content.trim();
        const lowerContent = content.toLowerCase();

        // Skip if it's just a filler word
        if (fillerWords.some(filler => lowerContent === filler)) {
            continue;
        }

        // Remove filler words from the content
        let cleanedContent = content;
        fillerWords.forEach(filler => {
            const regex = new RegExp(`\\b${filler}\\b`, 'gi');
            cleanedContent = cleanedContent.replace(regex, '').trim();
        });

        // Remove extra spaces
        cleanedContent = cleanedContent.replace(/\s+/g, ' ').trim();

        const words = cleanedContent.split(' ');
        // If it's 1-3 words and doesn't contain booking keywords, likely a name
        if (words.length >= 1 && words.length <= 3 &&
            !lowerContent.includes('book') &&
            !lowerContent.includes('appointment') &&
            !lowerContent.includes('physio') &&
            !lowerContent.includes('massage') &&
            !lowerContent.includes('consultation') &&
            !lowerContent.includes('monday') &&
            !lowerContent.includes('tuesday') &&
            !lowerContent.includes('wednesday') &&
            !lowerContent.includes('thursday') &&
            !lowerContent.includes('friday') &&
            !lowerContent.includes('am') &&
            !lowerContent.includes('pm') &&
            cleanedContent.length > 2) {
            name = cleanedContent;
            break;
        }
    }

    // Extract time - look for day and time mentions
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    let foundDay = '';
    let foundTime = '';
    let dayIndex = -1;

    for (let i = 0; i < days.length; i++) {
        if (allText.includes(days[i])) {
            foundDay = days[i].charAt(0).toUpperCase() + days[i].slice(1);
            dayIndex = i;
            break;
        }
    }

    // Look for time patterns (e.g., "2 pm", "10 am", "2:00", "14:00")
    const timeMatch = allText.match(/(\d{1,2})\s*(am|pm|:\d{2})?/i);
    if (timeMatch) {
        let hour = parseInt(timeMatch[1]);
        const modifier = timeMatch[2]?.toLowerCase();

        // Convert to 24-hour format
        if (modifier === 'pm' && hour < 12) {
            hour += 12;
        } else if (modifier === 'am' && hour === 12) {
            hour = 0;
        }

        foundTime = `${hour.toString().padStart(2, '0')}:00`;
    }

    // Create a proper ISO date string
    const now = new Date();

    if (dayIndex >= 0) {
        // Calculate the next occurrence of the specified day
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const targetDay = dayIndex + 1; // Convert to JS day (Monday = 1)
        let daysUntilTarget = targetDay - currentDay;

        if (daysUntilTarget <= 0) {
            daysUntilTarget += 7; // Next week
        }

        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + daysUntilTarget);

        // Set the time
        if (foundTime) {
            const [hours, minutes] = foundTime.split(':');
            targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else {
            targetDate.setHours(14, 0, 0, 0); // Default to 2 PM
        }

        time = targetDate.toISOString();
    } else {
        // No specific day mentioned, use today or tomorrow with the specified time
        const targetDate = new Date(now);

        if (foundTime) {
            const [hours, minutes] = foundTime.split(':');
            targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

            // If the time has already passed today, schedule for tomorrow
            if (targetDate < now) {
                targetDate.setDate(targetDate.getDate() + 1);
            }
        } else {
            // Default to tomorrow at 2 PM
            targetDate.setDate(targetDate.getDate() + 1);
            targetDate.setHours(14, 0, 0, 0);
        }

        time = targetDate.toISOString();
    }

    return { name, service, time };
}

export default function Simulator() {
    const { callStatus, setCallStatus, addTranscriptMessage, addAppointment } = useStore();
    const [agentState, setAgentState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
    const [userInput, setUserInput] = useState("");
    const [mode, setMode] = useState<InteractionMode>('text');
    const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
    const [isMuted, setIsMuted] = useState(false);
    const [bookedAppointmentIds, setBookedAppointmentIds] = useState<Set<string>>(new Set());
    const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(new Set());

    // Vapi integration
    const { start: startVapi, stop: stopVapi, isSessionActive, isSpeaking, messages: vapiMessages, setMuted } = useVapi();

    // Sync Vapi messages to transcript
    useEffect(() => {
        if (vapiMessages.length > 0) {
            const lastMessage = vapiMessages[vapiMessages.length - 1];

            if (lastMessage.transcript && lastMessage.role) {
                // Create a unique ID for this message to prevent duplicates
                const messageId = `${lastMessage.role}-${lastMessage.transcript}-${vapiMessages.length}`;

                // Only process if we haven't seen this message before
                if (!processedMessageIds.has(messageId)) {
                    setProcessedMessageIds(prev => new Set(prev).add(messageId));

                    addTranscriptMessage({
                        role: lastMessage.role === 'user' ? 'user' : 'agent',
                        text: lastMessage.transcript,
                        timestamp: Date.now()
                    });

                    // Update conversation history for context
                    if (lastMessage.role === 'user' || lastMessage.role === 'assistant') {
                        setConversationHistory(prev => [
                            ...prev,
                            { role: lastMessage.role as 'user' | 'assistant', content: lastMessage.transcript! }
                        ]);

                        // Check if this is a booking confirmation from the assistant
                        if (lastMessage.role === 'assistant' && lastMessage.transcript) {
                            const text = lastMessage.transcript.toLowerCase();
                            if (text.includes('booked') || text.includes('confirmed') ||
                                (text.includes('perfect') && text.includes('appointment'))) {
                                // Extract booking details from conversation history
                                const bookingData = extractBookingFromHistory([
                                    ...conversationHistory,
                                    { role: 'assistant', content: lastMessage.transcript }
                                ]);

                                // Create a unique ID based on the booking data to prevent duplicates
                                const bookingId = `${bookingData.name}-${bookingData.service}-${bookingData.time}`;

                                if (bookingData.name && bookingData.service && bookingData.time && !bookedAppointmentIds.has(bookingId)) {
                                    addAppointment({
                                        id: Math.random().toString(),
                                        customerName: bookingData.name,
                                        service: bookingData.service,
                                        time: bookingData.time,
                                        status: 'confirmed'
                                    });
                                    setBookedAppointmentIds(prev => new Set(prev).add(bookingId));
                                    console.log('Appointment added:', bookingData);
                                }
                            }
                        }
                    }
                }
            }
        }
    }, [vapiMessages]);

    // Sync Vapi speaking state
    useEffect(() => {
        if (mode === 'voice' && isSessionActive) {
            setAgentState(isSpeaking ? 'speaking' : 'listening');
        }
    }, [isSpeaking, isSessionActive, mode]);

    // Initial greeting for text mode
    useEffect(() => {
        if (callStatus === 'connected' && agentState === 'idle' && mode === 'text') {
            setTimeout(() => {
                setAgentState('speaking');
                const text = "Hello, thanks for calling Dr. Smith's clinic. May I have your full name please?";
                addTranscriptMessage({ role: 'agent', text, timestamp: Date.now() });
                setConversationHistory([{ role: 'assistant', content: text }]);

                setTimeout(() => {
                    setAgentState('listening');
                }, 3000);
            }, 1000);
        }
    }, [callStatus, mode]);

    const handleSendInput = async () => {
        if (!userInput.trim()) return;

        // User speaks
        addTranscriptMessage({ role: 'user', text: userInput, timestamp: Date.now() });
        setAgentState('processing');
        const currentInput = userInput;
        setUserInput("");

        // Add to conversation history
        const updatedHistory: ConversationMessage[] = [
            ...conversationHistory,
            { role: 'user', content: currentInput }
        ];
        setConversationHistory(updatedHistory);

        // Simulate processing delay
        setTimeout(async () => {
            // Use LLM for processing
            const response = await processUserInputWithLLM(currentInput, conversationHistory, {});

            setAgentState('speaking');
            addTranscriptMessage({ role: 'agent', text: response.text, timestamp: Date.now() });

            // Add assistant response to history
            const newHistory = [
                ...conversationHistory,
                { role: 'user' as const, content: currentInput },
                { role: 'assistant' as const, content: response.text }
            ];
            setConversationHistory(newHistory);

            // Check if this is a booking confirmation
            const responseText = response.text.toLowerCase();
            if (responseText.includes('booked') || responseText.includes('confirmed') ||
                (responseText.includes('perfect') && responseText.includes('appointment'))) {
                // Extract booking details from conversation history
                const bookingData = extractBookingFromHistory(newHistory);

                if (bookingData.name && bookingData.service && bookingData.time) {
                    addAppointment({
                        id: Math.random().toString(),
                        customerName: bookingData.name,
                        service: bookingData.service,
                        time: bookingData.time,
                        status: 'confirmed'
                    });
                    console.log('Appointment added (text mode):', bookingData);
                }
            }

            // Simulate speaking duration then back to listening
            setTimeout(() => {
                setAgentState(response.newState || 'listening');
                if (response.text.toLowerCase().includes("goodbye")) {
                    setCallStatus('ended');
                }
            }, 2000);

        }, 1500);
    };

    const handleStartCall = async () => {
        setCallStatus('connected');
        setBookedAppointmentIds(new Set()); // Reset booking tracker for new call
        setProcessedMessageIds(new Set()); // Reset message tracker for new call

        if (mode === 'voice') {
            // Start Vapi voice call
            await startVapi();
        }
    };

    const handleEndCall = () => {
        setCallStatus('ended');
        setAgentState('idle');
        setConversationHistory([]);
        setBookedAppointmentIds(new Set()); // Reset booking tracker
        setProcessedMessageIds(new Set()); // Reset message tracker

        if (mode === 'voice') {
            stopVapi();
        }
    };

    const toggleMute = () => {
        const newMutedState = !isMuted;
        setIsMuted(newMutedState);
        if (mode === 'voice') {
            setMuted(newMutedState);
        }
    };

    const switchMode = (newMode: InteractionMode) => {
        if (callStatus === 'connected') {
            // End current call before switching
            handleEndCall();
        }
        setMode(newMode);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Mode Selector */}
            <div className="bg-white p-3 border-b border-slate-200 flex items-center justify-center gap-2">
                <button
                    onClick={() => switchMode('text')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                        mode === 'text'
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                >
                    <MessageSquare className="w-4 h-4" />
                    Text + LLM
                </button>
                <button
                    onClick={() => switchMode('voice')}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
                        mode === 'voice'
                            ? "bg-emerald-600 text-white shadow-md"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    )}
                >
                    <PhoneCall className="w-4 h-4" />
                    Voice (Vapi.ai)
                </button>
            </div>

            {/* Phone Header */}
            <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <div className={cn("w-3 h-3 rounded-full animate-pulse",
                        callStatus === 'connected' ? "bg-emerald-500" : "bg-slate-300"
                    )} />
                    <span className="font-semibold text-slate-700">
                        {callStatus === 'idle' ? 'Ready to Call' :
                            callStatus === 'ringing' ? 'Calling...' :
                                callStatus === 'connected' ? `Connected (${mode === 'voice' ? 'Voice' : 'Text'})` : 'Call Ended'}
                    </span>
                </div>
                <div className="text-xs font-mono text-slate-400">
                    +1 (555) 012-3456
                </div>
            </div>

            {/* Main Display Area */}
            <div className="flex-1 relative overflow-hidden flex flex-col">
                {/* Transcript Overlay */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <LiveTranscript />
                </div>

                {/* Visualizer Area (Bottom) */}
                <div className="h-48 bg-slate-900 text-white p-6 flex flex-col items-center justify-center relative shadow-inner">
                    {callStatus === 'connected' ? (
                        <>
                            <div className="mb-4 text-blue-300 font-medium tracking-wider text-sm uppercase">
                                {agentState === 'speaking' ? 'Agent Speaking...' :
                                    agentState === 'listening' ? 'Listening...' :
                                        agentState === 'processing' ? 'Thinking...' : 'Idle'}
                            </div>
                            <Waveform active={agentState === 'speaking' || agentState === 'processing'} />
                            {mode === 'voice' && (
                                <div className="mt-4 text-xs text-slate-400">
                                    Powered by Vapi.ai
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-slate-500 text-sm">Start a call to interact</div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="p-4 bg-white border-t border-slate-200">
                {callStatus === 'connected' ? (
                    <div className="space-y-4">
                        {/* Text Input for Text Mode */}
                        {mode === 'text' && (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendInput()}
                                    placeholder="Type what you would say..."
                                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                />
                                <button
                                    onClick={handleSendInput}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Send
                                </button>
                            </div>
                        )}

                        {/* Voice Mode Info */}
                        {mode === 'voice' && (
                            <div className="text-center text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                🎤 Speak naturally - Vapi.ai is listening
                            </div>
                        )}

                        {/* Call Controls */}
                        <div className="flex justify-center gap-6 pt-2">
                            <button
                                onClick={toggleMute}
                                className={cn(
                                    "p-4 rounded-full transition-colors",
                                    isMuted
                                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                )}
                            >
                                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                            </button>
                            <button
                                onClick={handleEndCall}
                                className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                            >
                                <Phone className="w-6 h-6 rotate-[135deg]" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={handleStartCall}
                        className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3"
                    >
                        <Phone className="w-5 h-5" />
                        Start {mode === 'voice' ? 'Voice' : 'Demo'} Call
                    </button>
                )}
            </div>
        </div>
    );
}

