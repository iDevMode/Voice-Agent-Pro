"use client";

import { useState } from "react";
import { LayoutDashboard, Calendar as CalendarIcon, Users, Settings, Bell, Search, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import CalendarView from "./CalendarView";
import AppointmentList from "./AppointmentList";

export default function DashboardLayout() {
    const [activeTab, setActiveTab] = useState<'calendar' | 'appointments'>('calendar');

    return (
        <div className="flex h-full bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-slate-800">
                    <span className="font-bold text-white text-lg tracking-tight">VoiceAgent<span className="text-blue-500">Pro</span></span>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    <button
                        onClick={() => setActiveTab('calendar')}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            activeTab === 'calendar' ? "bg-blue-600 text-white" : "hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <CalendarIcon className="w-5 h-5" />
                        Calendar
                    </button>
                    <button
                        onClick={() => setActiveTab('appointments')}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            activeTab === 'appointments' ? "bg-blue-600 text-white" : "hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Appointments
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors">
                        <Users className="w-5 h-5" />
                        Customers
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors">
                        <Settings className="w-5 h-5" />
                        Settings
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                            JD
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">John Doe</p>
                            <p className="text-xs text-slate-500 truncate">Admin</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-semibold text-slate-900">
                            {activeTab === 'calendar' ? 'Calendar' : 'Appointments'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden sm:block">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                            />
                        </div>
                        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
                    {activeTab === 'calendar' ? <CalendarView /> : <AppointmentList />}
                </div>
            </main>
        </div>
    );
}
