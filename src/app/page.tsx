import Link from "next/link";
import { ArrowRight, Phone, Calendar, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Hero Section */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Phone className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">VoiceAgent<span className="text-blue-600">Pro</span></span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#case-study" className="hover:text-blue-600 transition-colors">Case Study</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          </nav>
          <Link href="/demo">
            <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all flex items-center gap-2">
              Launch Demo <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="pt-24 pb-32 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Live Demo Available
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8">
              Never miss a client call again.
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              An AI-powered voice agent that answers calls 24/7, books appointments directly into your calendar, and handles inquiries with human-like naturalness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2">
                  Try the Live Demo <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all">
                View Case Study
              </button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">24/7 Call Handling</h3>
                <p className="text-slate-600 leading-relaxed">
                  Answers every call instantly, day or night. Handles multiple concurrent calls so your customers never hear a busy signal.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Smart Scheduling</h3>
                <p className="text-slate-600 leading-relaxed">
                  Integrates directly with your calendar. Understands your business hours, buffers, and policies to prevent double-booking.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Enterprise Reliability</h3>
                <p className="text-slate-600 leading-relaxed">
                  Built on robust infrastructure with 99.9% uptime. Securely handles customer data and provides detailed audit logs.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
