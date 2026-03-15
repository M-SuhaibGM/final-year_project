import React from 'react';
import Image from "next/image";



const InterviewInterface = ({ interviewInfo, currentQuestionIndex, totalQuestions, activeUser }) => {
  const progress = (currentQuestionIndex / totalQuestions) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-full max-h-[500px]">
      {/* AI SIDE */}
      <div className={`relative rounded-[3rem] border-2 transition-all duration-700 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md
        ${activeUser ? 'border-blue-500 shadow-[0_0_50px_rgba(37,99,235,0.2)]' : 'border-white/10'}`}>

        <div className="absolute top-6 flex flex-col items-center gap-1">
          <div className={`h-2 w-2 rounded-full ${activeUser ? 'bg-blue-400 animate-ping' : 'bg-slate-600'}`}></div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Agent</span>
        </div>

        <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
          <Image src="/ai-model.jpg" fill className="object-cover" alt="AI" />
        </div>
        <h2 className="mt-6 font-black text-xl text-white">Jennifer</h2>

        {/* SMALL PROGRESS LINE INSIDE CARD */}
        <div className="absolute bottom-10 w-40 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* USER SIDE */}
      <div className="rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-sm flex flex-col items-center justify-center">
        <div className="h-32 w-32 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-full flex items-center justify-center text-5xl font-black text-white shadow-2xl ring-8 ring-white/5">
          {interviewInfo?.userName?.[0]}
        </div>
        <h2 className="mt-6 font-black text-xl text-white">{interviewInfo?.userName}</h2>
        <span className="mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Candidate</span>
      </div>
    </div>
  );
};

export default InterviewInterface;