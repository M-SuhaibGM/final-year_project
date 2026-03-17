import { Button } from "@/components/ui/button";
import { ArrowRight, Copy, Calendar, Users, Briefcase } from "lucide-react";
import moment from "moment/moment";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

function InterviewCard({ interview, viewDetail = false, index ,candidateCount }) {

  const url = process.env.NEXT_PUBLIC_HOST_URL + "/interview/" + interview?.interviewLink;
  console.log(interview)
  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!", {
      style: { background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe" }
    });
  };

  return (
    <div
      key={index}
      className="group relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between h-full"
    >
      <div>
        {/* Top Section: Date & AI Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-10 w-10 bg-blue-600 flex items-center justify-center rounded-xl shadow-lg shadow-blue-200">
            <span className="text-xs font-bold text-white tracking-widest">AI</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <Calendar className="w-3.5 h-3.5" />
            {moment(interview?.created_at).format("MMM DD, YYYY")}
          </div>
        </div>

        {/* Job Title */}
        <div className="space-y-1 mb-4">
          <h2 className="font-bold text-slate-800 text-xl group-hover:text-blue-600 transition-colors line-clamp-1">
            {interview?.jobPosition}
          </h2>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Standard Interview Mode</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between py-3 border-y border-slate-50 mb-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Duration</span>
            <span className="text-sm font-semibold text-slate-700">{interview?.duration} Mins</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Submissions</span>
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
              <Users className="w-4 h-4" />
              {candidateCount || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-2">
        {!viewDetail ? (
          <Button
            variant="outline"
            className="w-full py-5 border-blue-100 bg-blue-50/30 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-xl font-bold transition-all flex gap-2 group/btn"
            onClick={copyLink}
          >
            <Copy className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            Copy Interview Link
          </Button>
        ) : (
          <Link
            href={"/scheduled-interview/" + interview?.interviewLink + "/details"}
            className="block"
          >
            <Button
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2 group/btn transition-all"
            >
              View Full Details
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default InterviewCard;