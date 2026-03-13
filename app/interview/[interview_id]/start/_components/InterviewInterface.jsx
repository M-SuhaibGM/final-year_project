import React from 'react';
import { Timer, ListChecks } from "lucide-react";
import Image from "next/image";
import TimerComponent from "./TimerComponent";
import VoiceWaveform from "./VoiceWaveform";

const InterviewInterface = ({
  interviewInfo,
  currentQuestionIndex,
  totalQuestions,
  activeUser, // We use this to trigger the glow
  startTimer,
  resetTimer,
  volume
}) => {
  const progressPercentage = (currentQuestionIndex / totalQuestions) * 100;

  return (
    <>
      <style jsx>{`
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0px rgba(37, 99, 235, 0.4); }
          50% { box-shadow: 0 0 15px rgba(37, 99, 235, 0.8); }
          100% { box-shadow: 0 0 0px rgba(37, 99, 235, 0.4); }
        }
        .glow-active {
          animation: pulse-glow 1.5s infinite ease-in-out;
        }
      `}</style>

      <h2 className="font-bold text-xl flex justify-between items-center mb-5 text-slate-800">
        AI Interview Session
        <span className="flex gap-2 items-center text-sm font-medium bg-slate-100 p-2 px-4 rounded-full shadow-sm">
          <Timer className="h-4 w-4 text-primary" />
          <TimerComponent startTimer={startTimer} resetTimer={resetTimer} />
        </span>
      </h2>

      {/* --- PROGRESS SECTION --- */}
      <div className="mb-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold flex items-center gap-2 text-slate-500 uppercase tracking-wider">
            <ListChecks className="h-4 w-4" />
            Progress
          </span>
          <span className="text-sm font-bold text-primary bg-blue-50 px-3 py-1 rounded-full">
            Question {currentQuestionIndex} of {totalQuestions}
          </span>
        </div>

        {/* Outer Track */}
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
          {/* Inner Fill with Glow Logic */}
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out bg-primary 
              ${activeUser ? "glow-active" : ""}`}
            style={{
              width: `${progressPercentage}%`,
              boxShadow: activeUser ? '0 0 10px rgba(37, 99, 235, 0.5)' : 'none'
            }}
          ></div>
        </div>

        {activeUser && (
          <p className="text-[10px] text-primary font-bold mt-2 animate-pulse uppercase tracking-tighter">
            AI is speaking...
          </p>
        )}
      </div>
      <div className="my-10 flex flex-col items-center justify-center">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2 tracking-widest">
          {activeUser ? "Audio Input Active" : "Mic Standby"}
        </p>
        <div className="bg-slate-50 px-10 py-4 rounded-full border border-dashed border-slate-200">
          <VoiceWaveform volume={volume} isSpeaking={activeUser} />
        </div>
      </div>

      {/* --- AVATAR GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* AI Side */}
        <div className={`bg-white h-[300px] rounded-2xl border-2 flex flex-col items-center justify-center shadow-xl transition-all duration-500 ${activeUser ? 'border-primary ring-4 ring-blue-50' : 'border-slate-100'}`}>
          <div className="relative">
            {activeUser && <span className="absolute -inset-4 bg-blue-400 rounded-full blur-xl opacity-20 animate-pulse"></span>}
            <Image src="/ai-model.jpg" alt="AI" width={110} height={110} className="rounded-full border-4 border-white shadow-2xl relative z-10" />
          </div>
          <h2 className="mt-4 font-bold text-slate-700 uppercase tracking-widest text-xs">AI Recruiter</h2>
        </div>

        {/* User Side */}
        <div className="bg-white h-[300px] rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center shadow-xl">
          <div className="h-20 w-20 bg-slate-800 text-white rounded-full flex items-center justify-center text-3xl font-black shadow-inner">
            {interviewInfo?.userName?.[0]}
          </div>
          <h2 className="mt-4 font-bold text-slate-700 uppercase tracking-widest text-xs">{interviewInfo?.userName}</h2>
        </div>
      </div>
    </>
  );
};

export default InterviewInterface;