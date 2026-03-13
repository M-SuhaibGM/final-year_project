"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { 
  User, 
  Settings2, 
  Mic2, 
  MessageSquare, 
  LogOut, 
  History, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="bg-slate-50 h-[70vh] flex flex-col overflow-hidden rounded-xl border border-slate-200 shadow-sm">
      {/* Header: Fixed */}
      <div className="p-6 border-b bg-white flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-blue-600" />
            Settings
          </h1>
          <p className="text-slate-500 text-xs">Manage your account and preferences</p>
        </div>
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          variant="ghost"
          className="text-red-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin">
        
        {/* 1. Profile Section */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <User className="w-4 h-4" /> Account Profile
          </h2>
          <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="font-bold text-slate-800">{user?.name || "User Name"}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        </section>

        {/* 2. App Preferences */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Mic2 className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-bold text-slate-800">Voice Agents</p>
                  <p className="text-[10px] text-slate-500">Select AI interviewer voice</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm font-bold text-slate-800">AI Feedback</p>
                  <p className="text-[10px] text-slate-500">Adjust evaluation strictness</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-500" />
            </div>
          </div>
        </section>

        {/* 3. Billing & Payment History (NEW FEATURE) */}
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <History className="w-4 h-4" /> Recent Transactions
          </h2>
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-3 font-semibold text-slate-600">Date</th>
                  <th className="p-3 font-semibold text-slate-600">Plan</th>
                  <th className="p-3 font-semibold text-slate-600 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {/* Sample Row - You can map your payments here later */}
                <tr>
                  <td className="p-3 text-slate-500">Oct 24, 2025</td>
                  <td className="p-3 font-medium text-slate-700">Standard Pack</td>
                  <td className="p-3 text-right font-bold text-green-600">$12.00</td>
                </tr>
                <tr>
                  <td className="p-3 text-slate-500">Sep 15, 2025</td>
                  <td className="p-3 font-medium text-slate-700">Basic Pack</td>
                  <td className="p-3 text-right font-bold text-green-600">$5.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Security Info */}
        <section className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <p className="text-[11px] text-blue-700 font-medium">
            Your data is secured with AES-256 encryption and all interview records are private.
          </p>
        </section>

      </div>

      {/* Footer: Fixed */}
      <div className="p-4 bg-white border-t mt-auto">
        <Button
          onClick={() => router.push("/dashboard")}
          className="w-full bg-slate-900 text-white hover:bg-slate-800 text-xs py-5 rounded-xl transition-all active:scale-[0.98]"
        >
          ← Back to Dashboard
        </Button>
      </div>
    </div>
  );
}