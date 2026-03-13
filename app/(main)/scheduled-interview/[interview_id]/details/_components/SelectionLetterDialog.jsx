import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function SelectionLetterDialog({ candidate, recommendation }) {
  const [companyName, setCompanyName] = useState("Our Company");
  const [loading, setLoading] = useState(false);

  // Calculate average score
  const ratings = candidate?.feedback?.feedback?.rating;
  const avgScore = ratings
    ? (ratings.technicalSkills + ratings.communication + ratings.problemSolving + ratings.experience) / 4
    : 0;

  const letterTemplate = `
Dear ${candidate?.userName},

We are pleased to inform you that after reviewing your assessment, where you scored ${avgScore}/10, we would like to move forward with your application at ${companyName}.

We were particularly impressed with your performance summary: 
"${candidate?.feedback?.feedback?.summary}"

Best regards,
The Recruitment Team at ${companyName}
  `;

  const sendEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/send_email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: candidate?.userEmail,
          subject: `Job Application Update - ${companyName}`,
          message: letterTemplate,
          company: companyName,
        }),
      });

      if (!response.ok) throw new Error("Failed to send");

      toast.success("Email sent successfully!");
    } catch (error) {
      console.error("Nodemailer Error:", error);
      toast.error("Failed to send email. Check your server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className={`p-5 rounded-md ${recommendation === "No" ? "bg-red-700" : "bg-green-700"
            }`}
        >
          Send Msg
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Draft Selection Letter</DialogTitle>
        </DialogHeader>

        <div className="flex gap-6 mt-4">
          <div className="flex-1 bg-zinc-50 p-4 rounded-md border text-sm whitespace-pre-line overflow-y-auto max-h-[300px]">
            {letterTemplate}
          </div>

          <div className="w-1/3 flex flex-col gap-4">
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="company" className="text-sm font-medium">Company Name</label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
            <Button onClick={sendEmail} disabled={loading} className="w-full">
              {loading ? "Sending..." : "Confirm & Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SelectionLetterDialog;