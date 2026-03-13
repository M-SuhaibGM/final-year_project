"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

function PayButton({ amount, credits }) {
  const { data: session, update } = useSession(); // Added update
  const user = session?.user;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const success = searchParams.get("success");
    const sessionId = searchParams.get("session_id"); // Get session_id instead of credits

    if (success && sessionId && user?.email) {
      verifyAndAddCredits(sessionId);
    }
  }, [searchParams, user?.email]);

  const verifyAndAddCredits = async (sessionId) => {
    setLoading(true);
    try {
      const result = await axios.post("/api/add-credits", { sessionId });

      if (result.data.success) {
        toast.success("Payment verified! Credits added.");
        await update();
        router.replace("/billing"); // Clears the URL params immediately
      }
    } catch (error) {
      // If it was already added, the server returns 400, so we just redirect silently
      router.replace("/billing");
    } finally {
      setLoading(false);
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
    } catch (error) {
      toast.error("Payment initiation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full bg-blue-600 cursor-pointer text-white py-2 rounded-md font-medium hover:bg-blue-700 shadow-lg shadow-blue-100"
    >
      {loading ? <Loader2 className="animate-spin mr-2" /> : null}
      {loading ? "Processing..." : `Buy for $${amount}`}
    </Button>
  );
}

export default PayButton;