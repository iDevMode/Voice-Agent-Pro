import { create } from 'zustand';

export type Appointment = {
    id: string;
    customerName: string;
    service: string;
    time: string;
    status: 'confirmed' | 'pending' | 'cancelled';
    notes?: string;
};

export type TranscriptMessage = {
    role: 'agent' | 'user' | 'system';
    text: string;
    timestamp: number;
};

interface AppState {
    // Call State
    callStatus: 'idle' | 'ringing' | 'connected' | 'ended';
    setCallStatus: (status: 'idle' | 'ringing' | 'connected' | 'ended') => void;

    // Transcript
    transcript: TranscriptMessage[];
    addTranscriptMessage: (message: TranscriptMessage) => void;
    clearTranscript: () => void;

    // Appointments
    appointments: Appointment[];
    addAppointment: (appointment: Appointment) => void;
    updateAppointment: (id: string, updates: Partial<Appointment>) => void;

    // Simulation State
    currentDate: Date;
}

export const useStore = create<AppState>((set) => ({
    callStatus: 'idle',
    setCallStatus: (status) => set({ callStatus: status }),

    transcript: [],
    addTranscriptMessage: (message) => set((state) => ({ transcript: [...state.transcript, message] })),
    clearTranscript: () => set({ transcript: [] }),

    appointments: [
        { id: '1', customerName: 'Alice Johnson', service: 'Physiotherapy', time: '2023-10-27T10:00:00', status: 'confirmed' },
        { id: '2', customerName: 'Bob Smith', service: 'Massage', time: '2023-10-27T14:00:00', status: 'confirmed' },
    ],
    addAppointment: (appointment) => set((state) => ({ appointments: [...state.appointments, appointment] })),
    updateAppointment: (id, updates) => set((state) => ({
        appointments: state.appointments.map((appt) =>
            appt.id === id ? { ...appt, ...updates } : appt
        ),
    })),

    currentDate: new Date(),
}));
