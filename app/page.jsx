"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import { 
  CheckCircle2, 
  PlayCircle, 
  Sparkles, 
  Mic, 
  BarChart3, 
  Users, 
  X 
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton"; // Ensure you have this in components/ui

export default function LandingPage() {
  const router = useRouter();
  const [showContactModal, setShowContactModal] = useState(false);
  const { status } = useSession();

  // Unified action handler
  const handleAction = () => {
    if (status === "authenticated") {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-700">
      <Toaster position="top-center" />

      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <Image src="/logo.png" alt="logo" height={35} width={35} />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-blue-600">AI</span>Recruiter
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#whatsnew" className="hover:text-blue-600 transition-colors">What's New</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            {status === "loading" ? (
              // --- SKELETON STATE ---
              <>
                <Skeleton className="h-10 w-20 rounded-lg bg-slate-200" />
                <Skeleton className="h-10 w-28 rounded-lg bg-slate-200" />
              </>
            ) : (
              // --- AUTHENTICATED / UNAUTHENTICATED STATE ---
              <>
                <Button
                  variant={status === "authenticated" ? "default" : "ghost"}
                  className={status === "authenticated" ? "bg-blue-600 cursor-pointer hover:bg-blue-700" : "text-slate-600"}
                  onClick={handleAction}
                >
                  {status === "authenticated" ? "Dashboard" : "Login"}
                </Button>
                
                {status !== "authenticated" && (
                  <Button 
                    className="bg-blue-600 cursor-pointer hover:bg-blue-700 shadow-md shadow-blue-200" 
                    onClick={handleAction}
                  >
                    Get Started
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-6">
            <Sparkles className="w-3 h-3" />
            <span>Next Gen Hiring Experience</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-[1.1]">
            Conduct Interviews with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">AI Precision</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Automate your screening process with our AI voice agents. Save 40+ hours per week
            while finding higher quality talent with zero bias.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6 rounded-xl shadow-xl shadow-blue-200" onClick={handleAction}>
              Start Free Trial
            </Button>
            <a href="/demo.mp4" target="_blank">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 rounded-xl border-slate-200 bg-white">
                <PlayCircle className="mr-2 h-5 w-5 text-blue-600" /> Watch Demo
              </Button>
            </a>
          </div>

          {/* Decorative Dashboard Image */}
          <div className="relative mx-auto max-w-5xl group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
              <img src="/dashboard.png" alt="Dashboard Preview" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-blue-600 font-semibold tracking-wide uppercase text-sm mb-3">Capabilities</h2>
            <p className="text-3xl md:text-4xl font-bold text-slate-900">Everything you need to scale</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-100">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Voice Interviews</h3>
              <p className="text-slate-600 leading-relaxed">Natural conversation agents that can probe for deep technical knowledge across any domain.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all">
              <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-100">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Analytics</h3>
              <p className="text-slate-600 leading-relaxed">Get scored reports on communication, sentiment, and skill accuracy seconds after the call.</p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all">
              <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-cyan-100">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bias-Free Hiring</h3>
              <p className="text-slate-600 leading-relaxed">Ensure every candidate gets a fair shot with consistent, objective evaluation metrics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-600">Choose the plan that fits your recruiting volume.</p>
        </div>

        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8 max-w-6xl">
          {/* Free */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold mb-2">Starter</h3>
            <div className="mb-6"><span className="text-4xl font-bold">$0</span><span className="text-slate-500 text-sm"> /mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {["5 Interviews/mo", "Basic Feedback", "Web Interface"].map(i => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-blue-600" /> {i}</li>
              ))}
            </ul>
            <Button variant="outline" className="w-full py-6 border-slate-200" onClick={handleAction}>Get Started</Button>
          </div>

          {/* Pro */}
          <div className="bg-white p-8 rounded-3xl border-2 border-blue-600 shadow-xl shadow-blue-100 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Most Popular</div>
            <h3 className="text-lg font-bold mb-2">Pro Professional</h3>
            <div className="mb-6"><span className="text-4xl font-bold">$49</span><span className="text-slate-500 text-sm"> /mo</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              {["Unlimited Interviews", "AI Voice Assistant", "Full Analytics", "Custom Questions"].map(i => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-medium"><CheckCircle2 className="w-4 h-4 text-blue-600" /> {i}</li>
              ))}
            </ul>
            <Button className="w-full py-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200" onClick={handleAction}>Upgrade Now</Button>
          </div>

          {/* Enterprise */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
            <h3 className="text-lg font-bold mb-2">Enterprise</h3>
            <div className="mb-6"><span className="text-4xl font-bold">Custom</span></div>
            <ul className="space-y-4 mb-8 flex-1 text-left">
              {["Team Management", "API Access", "Custom Branding", "Dedicated Account Manager"].map(i => (
                <li key={i} className="flex items-center gap-3 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-blue-600" /> {i}</li>
              ))}
            </ul>
            <Button variant="outline" className="w-full py-6 border-slate-200" onClick={() => setShowContactModal(true)}>Contact Sales</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-10 border-b border-slate-800 pb-12 mb-12">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
              <Image src="/logo.png" alt="logo" height={30} width={30} className="brightness-200" />
              <span className="text-white text-xl font-bold tracking-tight">AI Recruiter</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed">Empowering modern HR teams with reliable AI voice intelligence.</p>
          </div>

          <div className="flex gap-10 text-sm">
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold mb-2 uppercase text-[10px] tracking-widest">Platform</span>
              <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold mb-2 uppercase text-[10px] tracking-widest">Company</span>
              <a href="#" className="hover:text-blue-400 transition-colors">About</a>
              <button onClick={() => setShowContactModal(true)} className="text-left hover:text-blue-400 transition-colors">Contact</button>
            </div>
          </div>
        </div>
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-xs">
          <p>© {new Date().getFullYear()} AI-Recruiter Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowContactModal(false)} />
          <div className="relative bg-white p-8 rounded-3xl w-full max-w-sm shadow-2xl">
            <button onClick={() => setShowContactModal(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100 transition-all">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-slate-900">Let's Talk</h2>
            <p className="text-slate-600 mb-8">Reach out to us on X (Twitter) for fast responses or enterprise inquiries.</p>
            <a href="https://twitter.com/vipinSao1" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-slate-900 text-white w-full py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg">
              Follow @vipinSao1
            </a>
          </div>
        </div>
      )}
    </div>
  );
}