"use client";

import { useStore } from "@/lib/store";
import { format, parseISO } from "date-fns";
import { MoreHorizontal, Calendar, Clock, User } from "lucide-react";

export default function AppointmentList() {
    const { appointments } = useStore();

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">Date & Time</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {appointments.map((appt) => (
                            <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="font-medium text-slate-900">{appt.customerName}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{appt.service}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 text-slate-900 font-medium">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {format(parseISO(appt.time), "MMM d, yyyy")}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                                            {format(parseISO(appt.time), "h:mm a")}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                            appt.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-amber-100 text-amber-800'}`}>
                                        {appt.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
