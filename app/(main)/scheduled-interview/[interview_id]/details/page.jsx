"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import InterviewDetailContainer from "./_components/InterviewDetailContainer";
import CandidateList from "./_components/CandidateList";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming you have shadcn skeleton

function InterviewDetails() {
  const { interview_id } = useParams();
  const { data: session } = useSession();
  const [interviewDetail, setInterviewDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email && interview_id) {
      GetInterviewDetail();
    }
  }, [session, interview_id]);

  const GetInterviewDetail = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/interviews/${interview_id}`);
      setInterviewDetail(response.data);
    } catch (error) {
      console.error("Error fetching interview details:", error);
    } finally {
      // Small timeout to prevent flicker on fast connections
      setTimeout(() => setLoading(false), 500);
    }
  };

  if (loading) {
    return (
      <div className="space-y-2 h-[68vh] overflow-hidden pr-2">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-2xl text-slate-800">Interview Analytics</h2>
          <p className="text-sm text-slate-500">
            Review job details and candidate performance reports.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-[250px] rounded-lg" />
          <Skeleton className="h-4 w-[350px] rounded-lg" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Main Detail Container Skeleton */}
          <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
            </div>
          </div>

          {/* Candidate List Skeleton */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <Skeleton className="h-6 w-[180px] mb-6" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                </div>
                <Skeleton className="h-8 w-[100px] rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!interviewDetail) {
    return (
      <div className="mt-10 text-center">
        <h2 className="text-xl font-semibold text-slate-600">Interview not found.</h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-[68vh] overflow-y-auto pr-2 scrollbar-thin">
      <div className="flex flex-col gap-1">
        <h2 className="font-bold text-2xl text-slate-800">Interview Analytics</h2>
        <p className="text-sm text-slate-500">
          Review job details and candidate performance reports.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <InterviewDetailContainer interviewDetail={interviewDetail} />

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <h3 className="font-bold text-lg mb-4 text-slate-700">Candidate Reports</h3>
          <CandidateList candidate={interviewDetail?.candidates} />
        </div>
      </div>
    </div>
  );
}

export default InterviewDetails;