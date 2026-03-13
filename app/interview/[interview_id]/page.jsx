"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Clock, Info, Loader2Icon, Video, User, Mail, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { InterviewDataContext } from "@/context/InterviewDataContext";

function Interview() {
  const { interview_id } = useParams();
  const [interviewData, setInterviewData] = useState();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const { setInterviewInfo } = useContext(InterviewDataContext);
  const router = useRouter();

  const GetInterviewDetail = async () => {
    setLoading(true);
    try {
      let { data: Interviews, error } = await supabase
        .from("Interviews")
        .select("jobPosition,jobDescription,duration,type")
        .eq("interview_link", interview_id);
      
      if (!Interviews || Interviews.length === 0) {
        toast.error("No Interview Found with this ID");
        return;
      }
      setInterviewData(Interviews[0]);
    } catch (error) {
      toast.error("Error fetching interview details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (interview_id) GetInterviewDetail();
  }, [interview_id]);

  const onJoinInterview = async () => {
    // Validation Check
    if (!userName.trim() || !userEmail.trim()) {
      toast.warning("Missing Information", {
        description: "Please enter both your name and email to continue.",
      });
      return;
    }

    setLoading(true);
    try {
      let { data: Interviews } = await supabase
        .from("Interviews")
        .select("*")
        .eq("interview_link", interview_id);

      setInterviewInfo({
        userName: userName,
        userEmail: userEmail,
        interviewData: Interviews[0],
      });

      router.push(`/interview/${interview_id}/start`);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row border border-blue-100">
        
        {/* Left Side: Info Panel (Blue Theme) */}
        <div className="bg-blue-600 p-8 md:w-2/5 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white p-2 rounded-lg">
                <Image src="/logo.png" alt="Logo" width={30} height={30} />
              </div>
              <h1 className="text-xl font-bold tracking-tight">AI-Recruiter</h1>
            </div>

            <h2 className="text-3xl font-extrabold mb-4 leading-tight">
              Ready for your next big step?
            </h2>
            <p className="text-blue-100 mb-6">
              You are about to start an AI-powered interview for:
            </p>
            
            <div className="bg-blue-500/30 backdrop-blur-md rounded-xl p-4 border border-blue-400/30">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="w-5 h-5 text-blue-200" />
                <span className="font-semibold">{interviewData?.jobPosition || "Loading..."}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-200" />
                <span>{interviewData?.duration || "--"} Minutes</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3 text-blue-200">
              <Info className="w-4 h-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">Instructions</span>
            </div>
            <ul className="space-y-2 text-sm text-blue-50">
              <li className="flex gap-2"><span>•</span> Test camera & microphone</li>
              <li className="flex gap-2"><span>•</span> Stable internet connection</li>
              <li className="flex gap-2"><span>•</span> Find a quiet environment</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800">Candidate Details</h3>
            <p className="text-gray-500">Please provide your info to begin the session.</p>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" /> Full Name
              </label>
              <Input
                placeholder="John Doe"
                className="h-12 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" /> Email Address
              </label>
              <Input
                type="email"
                placeholder="john@example.com"
                className="h-12 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>

            <Button
              className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mt-4 group"
              disabled={loading}
              onClick={onJoinInterview}
            >
              {loading ? (
                <Loader2Icon className="animate-spin mr-2" />
              ) : (
                <Video className="mr-2 group-hover:scale-110 transition-transform" />
              )}
              Join Interview
            </Button>
            
            <p className="text-center text-xs text-gray-400 mt-4">
              By clicking join, you agree to our platform terms and privacy policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;