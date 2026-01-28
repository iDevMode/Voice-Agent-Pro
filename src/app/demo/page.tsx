import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Simulator from "@/components/simulator/Simulator";

export default function DemoPage() {
    return (
        <div className="flex h-screen w-full bg-slate-100 overflow-hidden">
            {/* Left: Admin Dashboard */}
            <div className="flex-1 h-full overflow-hidden border-r border-slate-200 bg-white relative z-0">
                <DashboardLayout />
            </div>

            {/* Right: Simulator */}
            <div className="w-[400px] h-full bg-slate-50 flex flex-col border-l border-slate-200 shadow-xl z-10">
                <Simulator />
            </div>
        </div>
    );
}
