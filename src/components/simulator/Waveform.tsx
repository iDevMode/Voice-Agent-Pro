"use client";

import { cn } from "@/lib/utils";

export default function Waveform({ active }: { active: boolean }) {
    return (
        <div className="flex items-center gap-1 h-12">
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "w-1.5 bg-blue-400 rounded-full transition-all duration-300 ease-in-out",
                        active ? "animate-wave" : "h-2 opacity-50"
                    )}
                    style={{
                        animationDelay: `${i * 0.1}s`,
                        height: active ? '100%' : undefined
                    }}
                />
            ))}
            <style jsx>{`
        @keyframes wave {
          0%, 100% { height: 8px; opacity: 0.5; }
          50% { height: 32px; opacity: 1; }
        }
        .animate-wave {
          animation: wave 1s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
