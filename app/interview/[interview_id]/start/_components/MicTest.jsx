"use client";
import React, { useState, useEffect, useRef } from "react";
import { Mic, CheckCircle2, AlertCircle } from "lucide-react";
import VoiceWaveform from "./VoiceWaveform";

function MicTest({ onMicReady }) {
    const [volume, setVolume] = useState(0);
    const [isTesting, setIsTesting] = useState(false);
    const audioContext = useRef(null);
    const analyser = useRef(null);
    const animationFrame = useRef(null);

    const startMicTest = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsTesting(true);

            audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
            analyser.current = audioContext.current.createAnalyser();
            const source = audioContext.current.createMediaStreamSource(stream);
            source.connect(analyser.current);

            analyser.current.fftSize = 256;
            const bufferLength = analyser.current.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateVolume = () => {
                analyser.current.getByteFrequencyData(dataArray);
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                const average = sum / bufferLength;
                setVolume(average / 100); // Normalize for our waveform component
                animationFrame.current = requestAnimationFrame(updateVolume);
            };

            updateVolume();
        } catch (err) {
            console.error("Mic access denied", err);
        }
    };

    useEffect(() => {
        return () => {
            if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
            if (audioContext.current) audioContext.current.close();
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-10 bg-white border-2 border-dashed rounded-3xl shadow-sm">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
                <Mic className={`h-8 w-8 ${isTesting ? "text-primary animate-pulse" : "text-gray-400"}`} />
            </div>

            <h2 className="text-xl font-bold mb-2">Check Your Microphone</h2>
            <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">
                Speak normally to see if the bars move. This ensures the AI can hear you clearly.
            </p>

            <div className="w-full max-w-xs bg-slate-50 py-6 px-10 rounded-2xl mb-8 border border-slate-100">
                <VoiceWaveform volume={volume} isSpeaking={isTesting} />
            </div>

            {!isTesting ? (
                <button
                    onClick={startMicTest}
                    className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg"
                >
                    Test Microphone
                </button>
            ) : (
                <button
                    onClick={onMicReady}
                    className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition-all shadow-lg flex items-center gap-2"
                >
                    <CheckCircle2 className="h-5 w-5" />
                    Everything Works, Start Interview
                </button>
            )}
        </div>
    );
}

export default MicTest;