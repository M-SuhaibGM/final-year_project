"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner"; 


export default function CopyLinkButton({ url }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true)
            toast.success("Link copied to clipboard!");
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy link: ", err);
        }
    };

    return (
        <Button
            variant="outline"
            className={`w-full py-5 border-blue-100 bg-blue-50/30 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-xl font-bold transition-all flex gap-2 group/btn ${copied ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-600" : ""
                }`}
            onClick={handleCopy}
        >
            {copied ? (
                <Check className="w-4 h-4 scale-110 transition-transform" />
            ) : (
                <Copy className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            )}
            {copied ? "Copied!" : "Copy Interview Link"}
        </Button>
    );
}