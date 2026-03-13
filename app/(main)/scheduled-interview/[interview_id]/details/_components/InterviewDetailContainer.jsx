"use client";
import { Calendar, Clock, Briefcase, FileText, HelpCircle, ChevronDown } from "lucide-react";
import moment from "moment/moment";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function InterviewDetailContainer({ interviewDetail }) {

  if (!interviewDetail) {
    return (
      <div className="w-full bg-white border border-blue-50 rounded-3xl p-8 mt-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-1/3 bg-slate-100 rounded-lg" />
          <div className="flex gap-4">
            <Skeleton className="h-5 w-24 bg-slate-100 rounded-full" />
            <Skeleton className="h-5 w-24 bg-slate-100 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-32 w-full bg-slate-50 rounded-2xl" />
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full mt-6">
      <AccordionItem value="interview-details" className="border-none">
        {/* HEADER SECTION */}
        <AccordionTrigger className="group p-6 bg-white border border-blue-100 rounded-3xl hover:no-underline hover:bg-blue-50/50 transition-all shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full text-left gap-4 pr-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                  {interviewDetail?.jobPosition}
                </h2>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-1">
                  Active Interview Session
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-semibold text-slate-500 shadow-sm">
                <Clock className="h-3.5 w-3.5 text-blue-500" />
                {interviewDetail?.duration} Mins
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-full text-xs font-semibold text-slate-500 shadow-sm">
                <Calendar className="h-3.5 w-3.5 text-blue-500" />
                {moment(interviewDetail?.created_at).format("DD MMM, YYYY")}
              </div>
            </div>
          </div>
        </AccordionTrigger>

        {/* CONTENT SECTION */}
        <AccordionContent className="mt-2 p-8 bg-white border border-blue-50 rounded-3xl shadow-sm">
          {/* Detailed Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Limit</p>
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <Clock className="h-4 w-4 text-blue-600" />
                {interviewDetail?.duration} Minutes
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Created At</p>
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <Calendar className="h-4 w-4 text-blue-600" />
                {moment(interviewDetail?.created_at).format("DD MMM, YYYY")}
              </div>
            </div>
            {interviewDetail?.type && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assessment Type</p>
                <div className="flex items-center gap-2 text-slate-700 font-bold">
                  <FileText className="h-4 w-4 text-blue-600" />
                  {(interviewDetail?.type)[0]}
                </div>
              </div>
            )}
          </div>

          <hr className="border-slate-100 mb-8" />

          {/* Job Description */}
          <div className="space-y-3 mb-8">
            <h3 className="flex items-center gap-2 font-bold text-slate-800">
              <FileText className="h-4 w-4 text-blue-600" />
              Job Description
            </h3>
            <div className="bg-blue-50/30 p-5 rounded-2xl border border-blue-50">
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {interviewDetail?.jobDescription}
              </p>
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-slate-800">
              <HelpCircle className="h-4 w-4 text-blue-600" />
              Pre-set Interview Questions
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {interviewDetail?.questions.map((item, ind) => (
                <div
                  key={ind}
                  className="group flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-md bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
                    {ind + 1}
                  </span>
                  <p className="text-sm text-slate-600 font-medium group-hover:text-slate-900 transition-colors">
                    {item?.question}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default InterviewDetailContainer;