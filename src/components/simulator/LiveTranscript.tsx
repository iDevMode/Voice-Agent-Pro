"use client";

import { useStore } from "@/lib/store";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export default function LiveTranscript() {
    const { transcript } = useStore();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [transcript]);

    if (transcript.length === 0) {
        return (
            <div className="h-full flex items-center justify-center text-slate-400 text-sm italic">
                Transcript will appear here...
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {transcript.map((msg, idx) => (
                <div
                    key={idx}
                    className={cn(
                        "flex flex-col max-w-[85%]",
                        msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                >
                    <div className={cn(
                        "px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm",
                        msg.role === 'user'
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white text-slate-700 border border-slate-200 rounded-bl-none"
                    )}>
                        {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {msg.role === 'user' ? 'You' : 'Agent'}
                    </span>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    );
}
