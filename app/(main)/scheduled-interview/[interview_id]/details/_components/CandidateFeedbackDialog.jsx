import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import SelectionLetterDialog from "./SelectionLetterDialog";
import { FileText, Award, BarChart3, UserCheck, MessageSquare } from "lucide-react";

function CandidateFeedbackDialog({ candidate }) {
  const feedback = candidate?.feedback;
  const avgRating = feedback?.rating ? (
    (feedback?.rating?.technicalSkills +
      feedback?.rating?.communication +
      feedback?.rating?.problemSolving +
      feedback?.rating?.experience) / 4
  ).toFixed(1) : 0;

  const isRecommended = feedback?.recommendation !== "No";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 cursor-pointer flex gap-2 rounded-xl">
          <FileText className="w-4 h-4" />
          View Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl rounded-3xl p-0 overflow-hidden border-none outline-none">
        <DialogHeader className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-white">
              <Award className="w-5 h-5" /> Interview Performance Report
            </DialogTitle>
          </div>
          <DialogDescription className="text-blue-100 mt-1">
            Detailed AI-generated assessment for the candidate.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 max-h-[80vh] overflow-y-auto">
          {/* Candidate Profile Summary */}
          <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-blue-600 flex items-center justify-center rounded-2xl text-white font-bold text-xl shadow-lg shadow-blue-200">
                {candidate.userName[0].toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                  {candidate?.userName.toUpperCase()}
                </h2>
                <p className="text-sm text-slate-500">{candidate?.userEmail}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Overall Score</p>
              <h2 className="text-3xl font-black text-blue-600">{avgRating}<span className="text-slate-300 text-sm font-normal">/10</span></h2>
            </div>
          </div>

          {/* Skills Grid */}

          {avgRating == 0 ? (<>
            <div className="p-6 bg-red-100 border border-red-100 rounded-2xl mb-8">
              <h3 className="flex items-center gap-2 font-bold text-red-500 mb-4">
                {`User Exit the interview because ${candidate?.exitReason || "unknown reasons"}`}
              </h3>
            </div>
          </>) :
            (<div className="mb-8">
              <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                <BarChart3 className="w-4 h-4 text-blue-600" /> Skills Assessment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {[
                  { label: "Technical Skills", val: feedback?.rating?.technicalSkills },
                  { label: "Communication", val: feedback?.rating?.communication },
                  { label: "Problem Solving", val: feedback?.rating?.problemSolving },
                  { label: "Experience", val: feedback?.rating?.experience },
                ].map((skill) => (
                  <div key={skill.label} className="space-y-2">
                    <div className="flex justify-between text-sm font-semibold text-slate-700">
                      <span>{skill.label}</span>
                      <span className="text-blue-600">{skill.val}/10</span>
                    </div>
                    <Progress value={skill.val * 10} className="h-2 bg-blue-50" />
                  </div>
                ))}
              </div>
            </div>)}

          {/* Performance Summary */}

          {avgRating === 0 ? (<>
            <div className="mb-8">
              <h3 className="flex items-center gap-2 font-bold text-red-200 mb-3">
                <MessageSquare className="w-4 h-4 text-red-600" /> Performance Summary
              </h3>
              <div className="p-5 bg-red-50/50 border border-red-100 rounded-2xl">
                <p className="text-red-600 text-sm leading-relaxed italic">
                  {`No Summary because user exit the interview too early`}
                </p>
              </div>
            </div>
          </>) : (
            <div className="mb-8">
              <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-3">
                <MessageSquare className="w-4 h-4 text-blue-600" /> Performance Summary
              </h3>
              <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl">
                <p className="text-slate-600 text-sm leading-relaxed italic">
                  "{feedback?.summary}"
                </p>
              </div>
            </div>
          )}

          {/* Recommendation Section */}

          {avgRating === 0 ? (<>
          </>) :
            (
              <div className={`p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-4 ${isRecommended ? "bg-emerald-50 border-emerald-100" : "bg-rose-50 border-rose-100"
                }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg mt-1 ${isRecommended ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className={`font-bold text-sm uppercase tracking-wider ${isRecommended ? "text-emerald-700" : "text-rose-700"}`}>
                      AI Recommendation
                    </h2>
                    <p className={`text-sm mt-1 leading-snug ${isRecommended ? "text-emerald-800" : "text-rose-800"}`}>
                      {feedback?.recommendationMsg}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto">
                  <SelectionLetterDialog
                    candidate={candidate}
                    recommendation={feedback?.recommendation}
                  />
                </div>
              </div>)}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CandidateFeedbackDialog;