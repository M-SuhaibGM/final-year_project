"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import axios from "axios";
import {
  User, Settings2, Mic2, LogOut, History,
  ShieldCheck, Save, Loader2, CreditCard,
  ExternalLink, CheckCircle2, Globe, Volume2
} from "lucide-react";
import { getUserPayments } from "@/actions/payment-actions";

// ✅ FIXED: Working voice IDs with correct providers (2026)
const voiceOptions = [
  { id: "Elliot", name: "Elliot", desc: "Male • Neutral", provider: "vapi", tag: "FREE", tagColor: "bg-emerald-100 text-emerald-700" },
  { id: "Rohan", name: "Rohan", desc: "Male • English", provider: "vapi", tag: "FREE", tagColor: "bg-emerald-100 text-emerald-700" },
  { id: "Hana", name: "Hana", desc: "Female • Soft", provider: "vapi", tag: "FREE", tagColor: "bg-emerald-100 text-emerald-700" },
  { id: "Neha", name: "Neha", desc: "Female • Urdu/Hindi", provider: "vapi", tag: "FREE", tagColor: "bg-emerald-100 text-emerald-700" },
  { id: "Naina", name: "Naina", desc: "Female • South Asian", provider: "vapi", tag: "FREE", tagColor: "bg-emerald-100 text-emerald-700" },
  { id: "Sagar", name: "Sagar", desc: "Male • South Asian", provider: "vapi", tag: "FREE", tagColor: "bg-emerald-100 text-emerald-700" },
  { id: "Cole", name: "Cole", desc: "Male • Professional", provider: "vapi", tag: "FREE", tagColor: "bg-emerald-100 text-emerald-700" },
  { id: "Paige", name: "Paige", desc: "Female • Friendly", provider: "vapi", tag: "FREE", tagColor: "bg-emerald-100 text-emerald-700" },
];
const languageOptions = [
  { code: "en-US", name: "English (US)", flag: "🇺🇸" },
  { code: "hi-IN", name: "Hindi (India)", flag: "🇮🇳" },
  { code: "ur-PK", name: "Urdu (Pakistan)", flag: "🇵🇰" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [saved, setSaved] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    const loadPayments = async () => {
      const res = await getUserPayments();
      if (res.success) {
        setPayments(res.payments);
      }
      setLoadingPayments(false);
    };

    loadPayments();
  }, []);
  const [config, setConfig] = useState({
    language: "en-US",
    voiceId: "Elliot",
    voiceProvider: "vapi", // ✅ NEW: track provider
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get("/api/user-config");
        if (res.data) {
          setConfig({
            language: res.data.language || "en-US",
            voiceId: res.data.voiceId || "Elliot",
            voiceProvider: res.data.voiceProvider || "vapi", // ✅ Load provider
          });
        }
      } catch (err) {
        console.error("Failed to load settings");
      } finally {
        setFetching(false);
      }
    };
    if (session?.user?.email) fetchConfig();
  }, [session]);

  // ✅ When voice changes, auto-update provider too
  const handleVoiceChange = (voiceId) => {
    const selected = voiceOptions.find((v) => v.id === voiceId);
    setConfig({
      ...config,
      voiceId,
      voiceProvider: selected?.provider || "vapi",
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // ✅ Save voiceProvider alongside voiceId
      await axios.put("/api/user-config", config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      const voiceName = voiceOptions.find((v) => v.id === config.voiceId)?.name;
      toast.success("Settings saved!", {
        description: `Voice: ${voiceName} • Language: ${config.language}`,
      });
    } catch (error) {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedVoice = voiceOptions.find((v) => v.id === config.voiceId);
  const selectedLang = languageOptions.find((l) => l.code === config.language);

  if (fetching)
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
          <p className="text-sm text-slate-400 font-medium">Loading settings…</p>
        </div>
      </div>
    );

  return (
    <div className="bg-slate-50 min-h-[70vh] flex flex-col rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* ── Header ── */}
      <div className="p-6 border-b bg-white flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-blue-600" /> Settings
          </h1>
          <p className="text-slate-400 text-xs mt-0.5">Manage your account and AI agent preferences</p>
        </div>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="ghost"
          className="text-red-500 text-xs font-bold gap-2 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" /> Logout
        </Button>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Profile + Plan row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile card */}
          <section className="lg:col-span-2">
            <SectionLabel icon={<User className="w-3.5 h-3.5" />} label="Account Profile" />
            <div className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg shadow-md select-none">
                {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{session?.user?.name || "User"}</p>
                <p className="text-xs text-slate-400">{session?.user?.email}</p>
              </div>
              <span className="ml-auto text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full font-bold uppercase tracking-wide">
                Active
              </span>
            </div>
          </section>

          {/* Plan card */}
          <section>
            <SectionLabel icon={<CreditCard className="w-3.5 h-3.5" />} label="Active Plan" />
            <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg relative overflow-hidden h-[calc(100%-2rem)]">
              <p className="text-[10px] opacity-70 uppercase font-bold tracking-widest">Current Plan</p>
              <p className="text-lg font-black mt-0.5">Pro Recruiter</p>
              <p className="text-[10px] mt-3 bg-white/20 w-fit px-2.5 py-1 rounded-full">Renews Oct 2026</p>
              <CreditCard className="absolute -right-3 -bottom-3 w-20 h-20 opacity-10 rotate-12" />
            </div>
          </section>
        </div>

        {/* ── AI Agent Config ── */}
        <section className="p-6 bg-white rounded-2xl border border-blue-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <SectionLabel icon={<Mic2 className="w-3.5 h-3.5 text-blue-600" />} label="AI Agent Preferences" colored />
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-bold border border-blue-100">
              VAPI AI
            </span>
          </div>

          {/* Language picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" /> Interview Language
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {languageOptions.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setConfig({ ...config, language: lang.code })}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all text-sm font-medium
                    ${config.language === lang.code
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200"
                    }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-xs leading-tight">{lang.name}</span>
                  {config.language === lang.code && (
                    <CheckCircle2 className="w-4 h-4 text-blue-500 ml-auto shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Voice picker */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-slate-400" /> Voice Persona
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {voiceOptions.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => handleVoiceChange(voice.id)}
                  className={`flex flex-col gap-1.5 p-3.5 rounded-xl border-2 text-left transition-all
                    ${config.voiceId === voice.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-slate-100 bg-slate-50 hover:border-slate-200"
                    }`}
                >
                  {/* Avatar circle */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                    ${config.voiceId === voice.id ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}>
                    {voice.name.charAt(0)}
                  </div>
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <p className={`text-xs font-bold ${config.voiceId === voice.id ? "text-blue-700" : "text-slate-700"}`}>
                        {voice.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{voice.desc}</p>
                    </div>
                    {config.voiceId === voice.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                    )}
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded w-fit ${voice.tagColor}`}>
                    {voice.tag}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected voice summary */}
            {selectedVoice && (
              <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3 text-xs text-slate-500">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {selectedVoice.name.charAt(0)}
                </div>
                <span>
                  Selected: <span className="font-bold text-slate-700">{selectedVoice.name}</span>
                  {" · "}Provider: <span className="font-bold text-slate-700">{selectedVoice.provider}</span>
                  {" · "}Language: <span className="font-bold text-slate-700">{selectedLang?.flag} {selectedLang?.name}</span>
                </span>
              </div>
            )}
          </div>

          {/* Save button */}
          <Button
            onClick={handleSave}
            disabled={loading}
            className={`gap-2 px-8 transition-all active:scale-95 text-white
              ${saved ? "bg-emerald-600 hover:bg-emerald-700" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saved ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? "Saving…" : saved ? "Saved!" : "Save Configuration"}
          </Button>
        </section>

        {/* ── Transaction History ── */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <SectionLabel icon={<History className="w-3.5 h-3.5" />} label="Transaction History" />
            <Button variant="link" className="text-blue-600 text-[10px] h-auto p-0 gap-1">
              View Invoices <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["Date", "Description", "Status", "Amount"].map((h) => (
                    <th key={h} className="p-4 font-semibold text-slate-500 text-[11px] uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-4 text-slate-400">
                        {new Date(payment.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      <td className="p-4 font-medium text-slate-700">
                        {payment.creditsAdded} Credits Added
                      </td>

                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[10px] font-bold border border-green-100">
                          Paid
                        </span>
                      </td>

                      <td className="p-4 text-right font-bold text-slate-900">
                        ${payment.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-6 text-center text-slate-400"
                    >
                      No payment history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Security notice ── */}
        <section className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <p className="text-[11px] text-emerald-700 font-medium">
            Your billing information is encrypted. We use Stripe for secure payment processing.
          </p>
        </section>
      </div>

      {/* ── Footer ── */}
      <div className="p-4 bg-white border-t shrink-0">
        <Button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-slate-900 text-white text-xs py-5 rounded-xl hover:bg-slate-800 transition-all"
        >
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

// ── Tiny helper ──
function SectionLabel({ icon, label, colored }) {
  return (
    <h2 className={`text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5
      ${colored ? "text-blue-600" : "text-slate-400"}`}>
      {icon} {label}
    </h2>
  );
}