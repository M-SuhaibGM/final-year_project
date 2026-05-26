import { Button } from "@/components/ui/button";
import { ArrowRight, Users, CalendarDays, Briefcase } from "lucide-react";
import moment from "moment/moment";
import Link from "next/link";
import React from "react";

function CandidateReviewCard({ interview, index }) {

  const candidateCount = interview?.candidates?.length || 0;

  return (
    <div
      key={index}
      className="group relative w-full bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-all duration-300 overflow-hidden mb-4"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

        {/* Left Side: Job Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
              Live Results
            </span>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-400">
              <CalendarDays size={14} />
              {moment(interview?.created_at).format("MMM DD, YYYY")}
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            {interview?.jobPosition}
          </h2>

          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Briefcase size={14} />
              <span>{interview?.duration} mins</span>
            </div>
            <div className="flex items-center gap-1 text-green-600 font-medium">
              <Users size={14} />
              <span>{candidateCount} Candidates Applied</span>
            </div>
          </div>
        </div>

        {/* Right Side: Action Button */}
        <div className="w-full md:w-auto min-w-[200px]">
          <Link
            href={"/scheduled-interview/" + interview?.interviewLink + "/details"}
            className="w-full"
          >
            <Button
              className="w-full h-12 bg-primary hover:bg-black text-white flex items-center justify-center gap-2 transition-all duration-300 rounded-lg group"
            >
              Review Candidates
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CandidateReviewCard;