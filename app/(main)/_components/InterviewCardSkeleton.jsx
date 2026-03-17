import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const InterviewCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Top Section: AI Badge & Date */}
        <div className="flex items-center justify-between mb-4">
          {/* AI Badge Icon */}
          <Skeleton className="h-10 w-10 rounded-xl bg-slate-200" />
          {/* Date Badge */}
          <Skeleton className="h-7 w-28 rounded-full bg-slate-100" />
        </div>

        {/* Job Title & Subtitle */}
        <div className="space-y-2 mb-4">
          {/* Main Title */}
          <Skeleton className="h-7 w-3/4 bg-slate-200" />
          {/* Briefcase Icon + Subtext */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-sm bg-slate-100" />
            <Skeleton className="h-3 w-32 bg-slate-100" />
          </div>
        </div>

        {/* Stats Row (Middle) */}
        <div className="flex items-center justify-between py-3 border-y border-slate-50 mb-4">
          {/* Duration Stat */}
          <div className="space-y-1.5">
            <Skeleton className="h-2 w-12 bg-slate-100" />
            <Skeleton className="h-4 w-16 bg-slate-200" />
          </div>
          {/* Submissions Stat */}
          <div className="flex flex-col items-end space-y-1.5">
            <Skeleton className="h-2 w-16 bg-slate-100" />
            <div className="flex items-center gap-1.5">
              <Skeleton className="h-4 w-4 rounded-full bg-slate-200" />
              <Skeleton className="h-4 w-8 bg-slate-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Button (Bottom) */}
      <div className="mt-2">
        <Skeleton className="h-12 w-full rounded-xl bg-slate-200" />
      </div>
    </div>
  );
};

export default InterviewCardSkeleton;