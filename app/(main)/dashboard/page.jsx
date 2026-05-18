"use client";

import CreateOptions from "./_components/CreateOptions";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import InterviewCard from "./_components/interviewCard";
import InterviewCardSkeleton from "../_components/InterviewCardSkeleton";

const Dashboard = () => {
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
      const response = await axios.get("/api/interviews/all");
      setInterviewList(response.data || []);
    } catch (e) {
      console.error("Fetch failed:", e);
      setInterviewList([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="py-3 font-bold text-2xl">Dashboard</h2>
      <CreateOptions />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full">
            <InterviewCardSkeleton />
          </div>
        ) : interviewList.length > 0 ? (
          interviewList.map((interview, index) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              index={index}
              candidateCount={interview?._count?.candidates || 0} // Safely passing candidate count if it exists
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No interviews found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;