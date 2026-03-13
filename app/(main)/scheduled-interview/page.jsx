"use client";
import React, { useEffect, useState } from "react";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { useSession } from "next-auth/react";
import CandidateReviewCard from "./_components/CandidateReviewCard";
import CandidateReviewSkeleton from "./_components/loading";

function ScheduledInterview() {
  const { data: session } = useSession();
  const user = session?.user;
  
  const [interviewList, setInterviewList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/interviews/reports");
      setInterviewList(response.data || []);
    } catch (e) {
      console.error("Fetch failed:", e);
      setInterviewList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDERING LOGIC ---
  let content;

  if (isLoading) {
    content = (
      <div className="mt-5 space-y-4">
        <CandidateReviewSkeleton />
        <CandidateReviewSkeleton />
      </div>
    );
  } else if (interviewList?.length === 0) {
    content = (
      <div className="p-10 flex flex-col gap-4 items-center mt-5 border border-dashed rounded-2xl bg-slate-50">
        <Video className="h-12 w-12 text-slate-300" />
        <h2 className="text-slate-600 font-medium">No candidate reports available yet.</h2>
        <Link href={"/dashboard/create-interview"}>
          <Button className="bg-blue-600 hover:bg-blue-700 shadow-md">
            + Create Your First Interview
          </Button>
        </Link>
      </div>
    );
  } else {
    content = (
      <div className="mt-5 space-y-4">
        {interviewList.map((interview) => (
          <CandidateReviewCard
            key={interview.id}
            interview={interview}
            // Candidate reports are now nested inside 'candidates'
            candidates={interview.candidates} 
            viewDetail={true}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div>
        <h2 className="font-bold text-2xl text-slate-800">
          Interview Reports
        </h2>
        <p className="text-slate-500 text-sm">
          Review candidate performance and AI-generated feedback.
        </p>
      </div>
      {content}
    </div>
  );
}

export default ScheduledInterview;