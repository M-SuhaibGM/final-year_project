"use client";
import React, { useEffect, useRef, useState } from "react";

const TimerComponent = ({ startTimer, resetTimer }) => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);

  // ✅ Separate effect for the reset pulse — only zeroes the counter,
  //    does not touch the running interval
  useEffect(() => {
    if (resetTimer) {
      setSeconds(0);
    }
  }, [resetTimer]);

  // ✅ Separate effect for starting/stopping — only depends on startTimer,
  //    so it does NOT restart when resetTimer toggles
  useEffect(() => {
    if (startTimer) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [startTimer]); // ✅ resetTimer removed from deps — this is the key fix

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return <div className="font-mono text-lg">{formatTime(seconds)}</div>;
};

export default TimerComponent;