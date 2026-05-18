"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Link as LinkIcon,
  Sparkles,
  SendHorizonal,
  Briefcase,
} from "lucide-react";

export default function CommunicationPage() {
  const [interviews, setInterviews] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/interviews")
      .then((res) => res.json())
      .then((data) => setInterviews(data));
  }, []);

  const handleSendEmail = async () => {
    if (!selectedId || !candidateEmail) {
      return toast.error("Please fill all fields");
    }

    const selectedInterview = interviews.find(
      (i) => i.id === selectedId
    );

    const fullInterviewLink = `${window.location.origin}/interview/${selectedInterview.interviewLink}`;

    setLoading(true);

    try {
      const res = await fetch("/api/send-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: candidateEmail,
          interviewLink: fullInterviewLink,
          jobPosition: selectedInterview.jobPosition,
        }),
      });

      if (res.ok) {
        toast.success("Invitation sent successfully!");
        setCandidateEmail("");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to send");
      }
    } catch (error) {
      toast.error("Failed to send email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[78vh] overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-3 sm:p-5 relative">
      
      {/* Background Blur Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 h-full max-w-7xl mx-auto flex flex-col">
        
        {/* Header */}
        <div className="mb-4 sm:mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-xs sm:text-sm font-semibold mb-3 animate-bounce">
            <Sparkles size={15} />
            Smart Communication Panel
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 leading-tight">
            Send Interview{" "}
            <span className="text-blue-600">Invitations</span>
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-2xl">
            Manage interview communication professionally and send invitation
            emails to your candidates.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 flex-1 min-h-0">
          
          {/* Left Card */}
          <div className="bg-white/80 backdrop-blur-xl border border-blue-100 rounded-[30px] shadow-2xl p-5 sm:p-6 hover:shadow-blue-100 transition-all duration-500 h-full overflow-auto">
            
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-lg">
                <Mail size={24} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Email Details
                </h2>

                <p className="text-gray-500 text-sm">
                  Fill candidate information
                </p>
              </div>
            </div>

            <div className="space-y-5">
              
              {/* Interview Select */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Interview
                </label>

                <div className="relative">
                  <Briefcase
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                  />

                  <select
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                  >
                    <option value="">
                      -- Select Job Position --
                    </option>

                    {interviews.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.jobPosition}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Candidate Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                  />

                  <input
                    type="email"
                    placeholder="candidate@example.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                    value={candidateEmail}
                    onChange={(e) =>
                      setCandidateEmail(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={handleSendEmail}
                disabled={loading}
                className="group relative overflow-hidden w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 font-semibold shadow-xl hover:scale-[1.02] transition-all duration-300"
              >
                <span className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></span>

                <span className="relative flex items-center justify-center gap-3">
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <SendHorizonal size={20} />
                  )}

                  {loading
                    ? "Sending Invitation..."
                    : "Send Interview Invite"}
                </span>
              </button>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <h3 className="text-2xl font-bold text-blue-600">
                    {interviews.length}
                  </h3>

                  <p className="text-gray-600 text-sm">
                    Total Interviews
                  </p>
                </div>

                <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-4">
                  <h3 className="text-2xl font-bold text-cyan-600">
                    Live
                  </h3>

                  <p className="text-gray-600 text-sm">
                    Email Preview
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Card */}
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-[30px] shadow-2xl overflow-hidden p-1 h-full">
            
            {/* Glow */}
            <div className="absolute top-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl animate-pulse"></div>

            <div className="relative h-full bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[28px] p-5 sm:p-6 overflow-auto">
              
              {/* Preview Header */}
              <div className="flex items-center gap-3 mb-6 text-white">
                <div className="w-14 h-14 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-xl">
                  <LinkIcon size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    Email Preview
                  </h2>

                  <p className="text-blue-100 text-sm">
                    Live invitation preview
                  </p>
                </div>
              </div>

              {selectedId ? (
                <div className="bg-white rounded-3xl shadow-2xl p-6 animate-in fade-in zoom-in duration-500">
                  
                  {/* Subject */}
                  <div className="mb-5">
                    <p className="text-sm text-gray-500 mb-1">
                      Subject
                    </p>

                    <h3 className="font-bold text-lg text-gray-800 leading-snug">
                      Interview Invitation:
                      {" "}
                      {
                        interviews.find(
                          (i) => i.id === selectedId
                        )?.jobPosition
                      }
                    </h3>
                  </div>

                  <div className="h-px bg-gray-200 mb-5"></div>

                  {/* Email Body */}
                  <div className="space-y-4 text-sm sm:text-base text-gray-700">
                    <p>Hello Candidate,</p>

                    <p className="leading-relaxed">
                      We are pleased to invite you for an
                      interview for the selected position.
                      Please join using the interview link
                      provided below.
                    </p>

                    {/* Join Button */}
                    <div className="pt-2">
                      <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-medium shadow-lg hover:scale-105 transition-all duration-300">
                        Join Interview
                      </button>
                    </div>

                    {/* Footer Box */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mt-6">
                      <p className="text-blue-700 text-sm">
                        Includes interview instructions,
                        guidance, and rules for candidates.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-white">
                  <div className="text-center animate-pulse">
                    
                    <div className="w-24 h-24 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-5">
                      <Mail size={40} />
                    </div>

                    <h3 className="text-2xl font-bold mb-2">
                      No Preview Yet
                    </h3>

                    <p className="text-blue-100">
                      Select an interview to see live email
                      preview
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}