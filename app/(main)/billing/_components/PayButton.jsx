"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

function PayButton({ amount, credits, className }) {
  const { data: session, update } = useSession();
  const user = session?.user;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const verifyCalledRef = useRef(false); // ✅ prevents double-fire

  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id");

    // ✅ Guard: only run once per page load
    if (success && sessionId && user?.email && !verifyCalledRef.current) {
      verifyCalledRef.current = true;
      verifyAndAddCredits(sessionId);
    }
  }, [searchParams, user?.email]);

  const verifyAndAddCredits = async (sessionId) => {
    setLoading(true);
    try {
      const result = await axios.post("/api/add-credits", { sessionId });

      if (result.data.success) {
        await update();
        window.dispatchEvent(new CustomEvent("credits-updated"));
        toast.success(` credits added!`);

      }
    } catch (err) {
      // 400 = not paid yet, ignore
      if (err?.response?.status !== 400) {
        toast.error("Could not verify payment.");
      }
    } finally {
      setLoading(false);
      router.replace("/billing");
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/checkout", {
        amount,
        credits,
        email: user?.email,
      });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch {
      toast.error("Payment initiation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className={`w-full bg-blue-600 cursor-pointer text-white rounded-md font-medium hover:bg-blue-700 shadow-lg shadow-blue-100 ${className ?? ""}`}
    >
      {loading
        ? <><Loader2 className="animate-spin mr-2 w-4 h-4" /> Processing…</>
        : `Buy for $${amount}`
      }
    </Button>
  );
}

export default PayButton;