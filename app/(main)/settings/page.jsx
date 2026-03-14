"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import axios from "axios";
import { 
  User, Settings2, Mic2, LogOut, History, 
  ShieldCheck, Save, Loader2, CreditCard, ExternalLink
} from "lucide-react";

const voiceOptions = [
  { id: "jennifer", name: "Jennifer (Professional)", provider: "playht" },
  { id: "will", name: "Will (Friendly)", provider: "playht" },
  { id: "hindi-female-1", name: "Ananya (Hindi)", provider: "azure" }
];

const languageOptions = [
  { code: "en-US", name: "English (US)" },
  { code: "hi-IN", name: "Hindi (India)" },
  { code: "ur-PK", name: "Urdu (Pakistan)" }
];

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [config, setConfig] = useState({
    language: "en-US",
    voiceId: "jennifer"
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get("/api/user-config");
        if (res.data) {
          setConfig({ language: res.data.language, voiceId: res.data.voiceId });
        }
      } catch (err) {
        console.error("Failed to load settings");
      } finally {
        setFetching(false);
      }
    };
    if (session?.user?.email) fetchConfig();
  }, [session]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await axios.put("/api/user-config", config);
      toast.success("Settings Updated", {
        description: `Agent configured: ${voiceOptions.find(v => v.id === config.voiceId)?.name}`,
      });
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="flex justify-center items-center h-[70vh]"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="bg-slate-50 h-[70vh] flex flex-col overflow-hidden rounded-xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b bg-white flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-blue-600" /> Settings
          </h1>
          <p className="text-slate-500 text-xs">Manage your account and preferences</p>
        </div>
        <Button onClick={() => signOut({ callbackUrl: "/" })} variant="ghost" className="text-red-500 text-xs font-bold gap-2">
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
        
        {/* 1. Profile & Plan Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Account Profile
            </h2>
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                {session?.user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="font-bold text-slate-800">{session?.user?.name || "User Name"}</p>
                <p className="text-xs text-slate-500">{session?.user?.email}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Active Plan
            </h2>
            <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl text-white shadow-md relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-[10px] opacity-80 uppercase font-bold">Current Subscription</p>
                    <p className="text-lg font-bold">Pro Recruiter Pack</p>
                    <p className="text-[10px] mt-2 bg-white/20 w-fit px-2 py-0.5 rounded">Renews Oct 2026</p>
                </div>
                <CreditCard className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12" />
            </div>
          </section>
        </div>

        {/* 2. Agent Configuration Form */}
        <section className="p-6 bg-white rounded-2xl border border-blue-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
              <Mic2 className="w-4 h-4" /> AI Agent Preferences
            </h2>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">VAPI AI ENABLED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Interview Language</label>
              <select 
                value={config.language}
                onChange={(e) => setConfig({...config, language: e.target.value})}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
              >
                {languageOptions.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Voice Persona</label>
              <select 
                value={config.voiceId}
                onChange={(e) => setConfig({...config, voiceId: e.target.value})}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
              >
                {voiceOptions.map(voice => (
                  <option key={voice.id} value={voice.id}>{voice.name}</option>
                ))}
              </select>
            </div>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white gap-2 px-8 transition-transform active:scale-95"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Configuration
          </Button>
        </section>

        {/* 3. Billing & History */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <History className="w-4 h-4" /> Transaction History
            </h2>
            <Button variant="link" className="text-blue-600 text-[10px] h-auto p-0 gap-1">
                View Invoices <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 font-semibold text-slate-600">Date</th>
                  <th className="p-4 font-semibold text-slate-600">Description</th>
                  <th className="p-4 font-semibold text-slate-600">Status</th>
                  <th className="p-4 font-semibold text-slate-600 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <tr>
                  <td className="p-4 text-slate-500">Mar 10, 2026</td>
                  <td className="p-4 font-medium text-slate-700 text-blue-600">Pro Recruiter (Annual)</td>
                  <td className="p-4"><span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[10px] font-bold border border-green-100">Paid</span></td>
                  <td className="p-4 text-right font-bold text-slate-900">$120.00</td>
                </tr>
                <tr>
                  <td className="p-4 text-slate-500">Feb 15, 2026</td>
                  <td className="p-4 font-medium text-slate-700">Basic Credits Top-up</td>
                  <td className="p-4"><span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[10px] font-bold border border-green-100">Paid</span></td>
                  <td className="p-4 text-right font-bold text-slate-900">$15.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Security Info */}
        <section className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <p className="text-[11px] text-emerald-700 font-medium">
            Your billing information is encrypted. We use Stripe for secure payment processing.
          </p>
        </section>
      </div>

      {/* Footer */}
      <div className="p-4 bg-white border-t mt-auto shrink-0">
        <Button onClick={() => router.push("/dashboard")} className="w-full bg-slate-900 text-white text-xs py-5 rounded-xl hover:bg-slate-800 transition-all">
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
}