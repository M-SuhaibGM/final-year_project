import React from 'react';
import AlertConfirmation from "./AlertConfirmation";
import { Timer, Phone, Loader2, CheckCircle2 } from "lucide-react";
import TimerComponent from "./TimerComponent";
import VoiceWaveform from "./VoiceWaveform";

const InterviewControls = ({ 
    loading, 
    activeUser, 
    onStop, 
    volume, 
    startTimer, 
    resetTimer,
    currentQuestionIndex, // Pass this from parent
    totalQuestions        // Pass this from parent
}) => {
    const progress = Math.round((currentQuestionIndex / totalQuestions) * 100);
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="h-full flex items-center justify-between gap-6 px-4">
            
            {/* LEFT: TIMER SECTION */}
            <div className="flex-1 flex items-center">
                <div className="bg-blue-600 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-3 shadow-lg">
                    <Timer className="h-5 w-5 text-white animate-pulse" />
                    <span className="font-mono text-xl font-black text-white tracking-tight">
                        <TimerComponent startTimer={startTimer} resetTimer={resetTimer} />
                    </span>
                </div>
            </div>

            {/* CENTER: PROGRESS & WAVEFORM */}
            <div className="flex-[3] flex items-center justify-center gap-8 bg-blue-600 backdrop-blur-xl rounded-[2.5rem] border border-white/10 py-2 px-8 shadow-2xl">
                
                {/* CIRCULAR PROGRESS */}
                <div className="flex items-center gap-4 border-r border-white/10 pr-8">
                    <div className="relative flex items-center justify-center">
                        <svg className="w-16 h-16 transform -rotate-90">
                            <circle
                                cx="32" cy="32" r={radius}
                                stroke="currentColor" strokeWidth="4"
                                fill="transparent" className="text-white"
                            />
                            <circle
                                cx="32" cy="32" r={radius}
                                stroke="currentColor" strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                className="text-blue-500 transition-all duration-1000 ease-in-out"
                            />
                        </svg>
                        <span className="absolute text-[12px] font-black text-white">{progress}%</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-white uppercase tracking-widest">Progress</span>
                        <span className="text-sm font-black text-white">Q {currentQuestionIndex} / {totalQuestions}</span>
                    </div>
                </div>

                {/* WAVEFORM */}
                <div className="flex flex-col items-center min-w-[150px]">
                    <VoiceWaveform volume={volume} isSpeaking={activeUser} color="#3b82f6" />
                    <div className="flex items-center gap-2 mt-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${activeUser ? 'bg-green-400 animate-ping' : 'bg-slate-500'}`}></div>
                        <p className="text-[10px] text-white font-bold uppercase tracking-[0.3em]">
                            {activeUser ? "AI Speaking" : "Listening"}
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT: END CALL BUTTON */}
            <div className="flex-1 flex justify-end">
                {!loading ? (
                    <AlertConfirmation stopInterview={onStop}>
                        <button className="h-14 px-8 bg-red-500 hover:bg-red-700 text-white rounded-2xl flex items-center gap-4 font-black transition-all shadow-xl shadow-red-500/20 active:scale-95 group border-b-4 border-red-800">
                            <Phone className="h-5 w-5 fill-current rotate-[135deg] group-hover:animate-bounce" />
                            <span className="uppercase tracking-tighter text-xs">End Session</span>
                        </button>
                    </AlertConfirmation>
                ) : (
                    <div className="h-14 w-14 flex items-center justify-center bg-white/10 rounded-2xl border border-white/20">
                        <Loader2 className="animate-spin text-blue-500 h-6 w-6" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterviewControls;