import React from 'react';
import { Mic, Phone, Loader2Icon } from "lucide-react";
import AlertConfirmation from "./AlertConfirmation";

const InterviewControls = ({ loading, activeUser, onStop }) => {
    return (
        <div className="flex flex-col items-center mt-8">
            <div className="flex items-center gap-5 justify-center">
                <Mic className="h-14 w-14 p-4 bg-gray-100 text-gray-400 rounded-full" />

                {/* The AlertConfirmation should handle the trigger properly */}
                {!loading ? (
                    <AlertConfirmation stopInterview={onStop}>
                        <div className="h-14 w-14 p-4 bg-red-500 rounded-full text-white hover:bg-red-600 shadow-lg flex items-center justify-center cursor-pointer">
                            <Phone />
                        </div>
                    </AlertConfirmation>
                ) : (
                    <Loader2Icon className="animate-spin text-primary h-10 w-10" />
                )}
            </div>
            <p className="text-sm text-gray-400 mt-5 italic">
                {activeUser ? "Interview in Progress..." : "Connecting..."}
            </p>
        </div>
    );
};

export default InterviewControls;