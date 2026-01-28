"use client";

import { useStore } from "@/lib/store";
import { format, startOfToday, addHours, isSameDay, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

export default function CalendarView() {
    const { appointments } = useStore();
    const today = startOfToday();
    const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">
                    {format(today, "MMMM d, yyyy")}
                </h2>
                <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md">Day</button>
                    <button className="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-md">Week</button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto relative">
                {/* Time Grid */}
                <div className="min-h-[600px]">
                    {hours.map((hour) => (
                        <div key={hour} className="flex border-b border-slate-100 h-20 group">
                            <div className="w-16 flex-shrink-0 border-r border-slate-100 p-2 text-xs text-slate-500 text-right font-medium">
                                {format(addHours(today, hour), "h a")}
                            </div>
                            <div className="flex-1 relative p-1 group-hover:bg-slate-50/50 transition-colors">
                                {/* Render appointments for this hour */}
                                {appointments
                                    .filter(appt => {
                                        const apptDate = parseISO(appt.time);
                                        return isSameDay(apptDate, today) && apptDate.getHours() === hour;
                                    })
                                    .map(appt => (
                                        <div
                                            key={appt.id}
                                            className={cn(
                                                "absolute left-2 right-2 top-1 bottom-1 rounded-md p-2 text-xs border-l-4 shadow-sm transition-all hover:shadow-md cursor-pointer",
                                                appt.status === 'confirmed' ? "bg-blue-50 border-blue-500 text-blue-700" :
                                                    appt.status === 'cancelled' ? "bg-red-50 border-red-500 text-red-700 opacity-60" :
                                                        "bg-amber-50 border-amber-500 text-amber-700"
                                            )}
                                        >
                                            <div className="font-bold">{appt.customerName}</div>
                                            <div>{appt.service}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
