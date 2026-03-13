"use client";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import InterviewCard from "../dashboard/_components/interviewCard";
import Link from "next/link";
import InterviewCardSkeleton from "../_components/InterviewCardSkeleton";
import { useSession } from "next-auth/react";
import axios from "axios"; // 👈 Import axios

function AllInterview() {
  const [interviewList, setInterviewList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (user?.email) {
      GetInterviewList();
    }
  }, [user]);

  const GetInterviewList = async () => {
    setIsLoading(true);
    try {
      // Calling our new Prisma API
      const response = await axios.get("/api/interviews/all");
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
        {[1, 2, 3].map((i) => (
          <InterviewCardSkeleton key={i} />
        ))}
      </div>
    );
  } else if (interviewList?.length === 0) {
    content = (
      <div className="p-10 flex flex-col gap-3 items-center mt-5 border border-dashed rounded-xl bg-white">
        <Video className="h-12 w-12 text-slate-300" />
        <h2 className="font-medium text-slate-600">You haven't created any interviews yet.</h2>
        <Link href={"/dashboard/create-interview"}>
          <Button className="bg-blue-600 hover:bg-blue-700 mt-2">
            + Create New Interview
          </Button>
        </Link>
      </div>
    );
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
        {interviewList.map((interview) => (
          <InterviewCard
            interview={interview}
            key={interview.id}
            // Passing the count if you want to show it on the card
            candidateCount={interview?.candidates}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="my-5">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl text-slate-800">Your Interviews</h2>
        <p className="text-sm text-slate-500">{interviewList.length} total</p>
      </div>
      {content}
    </div>
  );
}

export default AllInterview;