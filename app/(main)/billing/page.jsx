"use client";
import { ArrowRight, CreditCard, Check, Zap, ShieldCheck, Trophy } from "lucide-react";
import React, { useEffect, useState } from "react";
import PayButton from "./_components/PayButton";
import { useSession } from "next-auth/react";
import { getUserCredits } from "@/actions/user";

const plans = [
  {
    name: "Basic",
    price: "5",
    interviews: 20,
    icon: Zap,
    features: ["Templates", "Email support", "AI Voice"],
  },
  {
    name: "Standard",
    price: "12",
    interviews: 50,
    icon: ShieldCheck,
    recommended: true,
    features: ["All templates", "Priority support", "Analytics", "Custom Links"],
  },
  {
    name: "Pro",
    price: "25",
    interviews: 120,
    icon: Trophy,
    features: ["Unlimited", "24/7 support", "Advanced Analytics", "Teams"],
  },
];

function Billing() {
  const { data: session } = useSession();
  const user = session?.user;
  const [credits, setLiveCredits] = useState(0);

  useEffect(() => {
    if (user?.id) {
      const fetchFreshCredits = async () => {
        const credits = await getUserCredits();
        setLiveCredits(credits);
      };
      fetchFreshCredits();
    }
  }, [user]);

  return (
    /* Change: Added h-[70vh] and overflow-hidden to prevent scrollbars */
    <div className="p-4 md:p-6 bg-slate-50 h-[70vh] flex flex-col overflow-hidden">
      
      {/* Header Section: Reduced margins */}
      <div className="mb-4">
        <h1 className="text-xl font-extrabold text-slate-900">Billing & Credits</h1>
        <p className="text-slate-500 text-xs">Manage your usage and top up your credits.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1 overflow-hidden min-h-0">

        {/* LEFT: Current Usage (Made narrower to save horizontal space) */}
        <div className="lg:col-span-1 h-full">
          <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-sm relative h-full flex flex-col justify-center">
            <h2 className="font-bold text-base text-slate-800 mb-1">Account Credits</h2>
            <p className="text-[10px] text-slate-500 mb-4">Conduct AI interviews.</p>

            <div className="bg-blue-600 rounded-xl p-4 text-white shadow-lg shadow-blue-200">
              <div className="flex items-center gap-2 mb-1 opacity-80">
                <CreditCard className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Balance</span>
              </div>
              <div className="text-3xl font-black">{credits}</div>
              <p className="text-blue-100 text-[9px] uppercase">Remaning</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Purchase Plans (Now spans 3 columns) */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-3 h-full overflow-hidden">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col p-4 bg-white rounded-2xl border transition-all ${
                plan.recommended
                  ? "border-blue-600 shadow-md ring-2 ring-blue-50"
                  : "border-slate-200"
              }`}
            >
              {plan.recommended && (
                <div className="absolute top-1 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-tighter shadow-sm z-10">
                  Popular
                </div>
              )}

              <div className="mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${plan.recommended ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600'}`}>
                  <plan.icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 leading-tight">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-slate-900">${plan.price}</span>
                </div>
                <p className="text-blue-600 font-bold text-xs">
                  {plan.interviews} Interviews
                </p>
              </div>

              <ul className="flex-1 space-y-1.5 mb-4 overflow-hidden">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-[11px] text-slate-600">
                    <Check className="w-3 h-3 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <PayButton
                  amount={plan.price}
                  credits={plan.interviews}
                  /* Compact button styling */
                  className="w-full py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Billing;