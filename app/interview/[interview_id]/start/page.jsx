"use client";
import React, { useContext, useEffect, useRef, useState, useMemo } from "react";
import { InterviewDataContext } from "@/context/InterviewDataContext";
import Vapi from "@vapi-ai/web";
import { toast } from "sonner";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import InterviewInterface from "./_components/InterviewInterface";
import InterviewControls from "./_components/InterviewControls";
import MicTest from "./_components/MicTest";
import { Bot, Wifi, Clock, Shield } from "lucide-react";
import {STYLES} from "@/services/Constants"



function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const vapi = useRef();
  const [hasInterviewStarted, setHasInterviewStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [config, setConfig] = useState({ language: "en-US", voiceId: "Elliot", voiceProvider: "vapi" });
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const [isMicChecked, setIsMicChecked] = useState(false);
  const [volume, setVolume] = useState(0);
  const [elapsedSecs, setElapsedSecs] = useState(0);

  const { interview_id } = useParams();
  const router = useRouter();

  const currentQuestionIndexRef = useRef(1);
  const progressPercentageRef = useRef(0);
  const conversationRef = useRef();
  const feedbackCalledRef = useRef(false);
  const isCallActiveRef = useRef(false);
  const initStartedRef = useRef(false);
  const timerRef = useRef(null);

  /* ── elapsed timer ── */
  useEffect(() => {
    if (activeUser) {
      timerRef.current = setInterval(() => setElapsedSecs(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [activeUser]);

  const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  /* ── fetch config ── */
  useEffect(() => {
    const VALID = ["Clara", "Godfrey", "Layla", "Sid", "Gustavo", "Elliot", "Kylie", "Rohan",
      "Lily", "Savannah", "Hana", "Neha", "Cole", "Harry", "Paige", "Spencer", "Nico", "Kai",
      "Emma", "Sagar", "Neil", "Naina", "Leah", "Tara", "Jess", "Leo", "Dan", "Mia", "Zac", "Zoe"];
    axios.get("/api/user-config").then(res => {
      if (res.data) setConfig({
        language: res.data.language || "en-US",
        voiceId: VALID.includes(res.data.voiceId) ? res.data.voiceId : "Elliot",
        voiceProvider: "vapi",
      });
    }).catch(() => { }).finally(() => setIsConfigLoaded(true));
  }, []);

  const totalQuestions = interviewInfo?.interviewData?.questions?.length || 5;

  const currentQuestionIndex = useMemo(() => {
    if (!conversation) return 1;
    try {
      const logs = JSON.parse(conversation);
      return Math.min(logs.filter(m => m.role === "assistant" || m.role === "bot").length + 1, totalQuestions);
    } catch { return 1; }
  }, [conversation, totalQuestions]);

  const progressPercentage = useMemo(() =>
    Math.round((currentQuestionIndex / totalQuestions) * 100),
    [currentQuestionIndex, totalQuestions]);

  useEffect(() => {
    currentQuestionIndexRef.current = currentQuestionIndex;
    progressPercentageRef.current = progressPercentage;
  }, [currentQuestionIndex, progressPercentage]);

  useEffect(() => { conversationRef.current = conversation; }, [conversation]);

  /* ── vapi setup ── */
  useEffect(() => {
    if (!interviewInfo || hasInterviewStarted || !isMicChecked || !isConfigLoaded) return;
    if (initStartedRef.current) return;
    initStartedRef.current = true;

    vapi.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);

    vapi.current.on("call-start", () => { isCallActiveRef.current = true; setActiveUser(true); });
    vapi.current.on("speech-start", () => { toast.success("Interview started!"); setStartTimer(false); setResetTimer(true); });
    vapi.current.on("speech-end", () => { setStartTimer(true); setResetTimer(false); });
    vapi.current.on("volume-level", (l) => setVolume(l));
    vapi.current.on("message", (msg) => {
      if (msg?.conversation) { const c = JSON.stringify(msg.conversation); setConversation(c); conversationRef.current = c; }
      else if (msg?.type === "transcript" && msg?.transcript) { const c = JSON.stringify(msg.transcript); setConversation(c); conversationRef.current = c; }
    });
    vapi.current.on("call-end", () => {
      if (feedbackCalledRef.current) return;
      feedbackCalledRef.current = true;
      isCallActiveRef.current = false;
      const idx = currentQuestionIndexRef.current;
      const prog = progressPercentageRef.current;
      const conv = conversationRef.current;
      const reason = idx >= totalQuestions ? "Interview Completed Normally" : "User Ended Early";
      toast.success("Interview ended!");
      setActiveUser(false);
      GenerateFeedback(reason, prog, conv);
    });
    vapi.current.on("error", (err) => {
      console.error("❌ [Vapi] error:", JSON.stringify(err), err);
      if (!isCallActiveRef.current) return;
      toast.error("Connection error — check mic and refresh.");
    });

    if (interviewInfo?.interviewData?.questions?.length) { startCall(); setHasInterviewStarted(true); }

    return () => {
      if (isCallActiveRef.current && vapi.current) { try { vapi.current.stop(); } catch { } isCallActiveRef.current = false; }
    };
  }, [interviewInfo, isMicChecked, isConfigLoaded]);

  const startCall = () => {
    const VALID = ["Clara", "Godfrey", "Layla", "Sid", "Gustavo", "Elliot", "Kylie", "Rohan",
      "Lily", "Savannah", "Hana", "Neha", "Cole", "Harry", "Paige", "Spencer", "Nico", "Kai",
      "Emma", "Sagar", "Neil", "Naina", "Leah", "Tara", "Jess", "Leo", "Dan", "Mia", "Zac", "Zoe"];
    const langMap = { "en-US": "en-US", "hi-IN": "hi", "ur-PK": "multi" };
    const sysLang = { "en-US": "English", "hi-IN": "Hindi (हिंदी). Always respond in Hindi script.", "ur-PK": "Urdu (اردو). Always respond in Urdu script." };
    const ql = interviewInfo?.interviewData?.questions.map((q, i) => `${i + 1}. ${q.question}`).join("\n");
    let welcome = `Hi ${interviewInfo?.userName}! Ready to start?`;
    if (config.language.startsWith("hi")) welcome = `नमस्ते ${interviewInfo?.userName}! क्या आप साक्षात्कार शुरू करने के लिए तैयार हैं?`;
    if (config.language.startsWith("ur")) welcome = `اسلام و علیکم ${interviewInfo?.userName}! کیا آپ انٹرویو کے لیے تیار ہیں؟`;
    vapi.current.start({
      name: "AI Recruiter",
      firstMessage: welcome,
      transcriber: { provider: "deepgram", model: "nova-2", language: langMap[config.language] || "en-US" },
      voice: { provider: "vapi", voiceId: VALID.includes(config.voiceId) ? config.voiceId : "Elliot" },
      model: {
        provider: "openai", model: "gpt-4o-mini", messages: [{
          role: "system",
          content: `You are an AI recruiter. Conduct the interview in ${sysLang[config.language] || "English"}. Ask these questions one by one:\n${ql}\nWait for the user's full answer before moving to the next question.`
        }]
      },
    });
  };

  const GenerateFeedback = async (reason, progress, conv) => {
    setLoading(true);
    try {
      const aiRes = await axios.post("/api/ai-feedback", { conversation: conv });
      if (aiRes.data.error) throw new Error(aiRes.data.error);
      const parsed = typeof aiRes.data === "string"
        ? JSON.parse(aiRes.data.replace(/```json|```/gi, "").trim())
        : aiRes.data;
      await axios.post("/api/interview-feedback", {
        userName: interviewInfo?.userName, userEmail: interviewInfo?.userEmail,
        interviewId: interview_id, feedback: parsed,
        exitReason: reason, progressAtExit: progress,
        completionStatus: progress === 100 ? "Success" : "Incomplete",
      });
      router.replace(`/interview/${interview_id}/completed`);
    } catch (err) {
      console.error(err);
      toast.error("Feedback error — redirecting…");
      setTimeout(() => router.replace(`/interview/${interview_id}/completed`), 2000);
    } finally { setLoading(false); }
  };

  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <>
      <style>{STYLES}</style>

      <div className="h-screen w-screen overflow-hidden flex flex-col relative"
        style={{ background: "#020817", fontFamily: "'DM Sans', sans-serif" }}>

        {/* ══ ANIMATED BACKGROUND ══ */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Orbs */}
          <div className="orb-1 absolute top-[-15%] left-[-10%] w-[55%] h-[55%] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(37,99,235,.18) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <div className="orb-2 absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,.14) 0%, transparent 70%)", filter: "blur(80px)" }} />
          <div className="orb-3 absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(6,182,212,.1) 0%, transparent 70%)", filter: "blur(50px)" }} />

          {/* Dot grid */}
          <div className="grid-pulse absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(148,163,184,.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }} />

          {/* Subtle horizontal lines */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute left-0 right-0 h-px"
              style={{ top: `${15 + i * 14}%`, background: "rgba(255,255,255,.02)" }} />
          ))}
        </div>

        {/* ══ HEADER ══ */}
        <header className="header-anim relative z-20 h-16 shrink-0 flex items-center justify-between px-6 md:px-10"
          style={{ borderBottom: "1px solid rgba(255,255,255,.06)", background: "rgba(2,8,23,.7)", backdropFilter: "blur(20px)" }}>

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl blur-md" style={{ background: "rgba(37,99,235,.5)" }} />
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", border: "1px solid rgba(96,165,250,.3)" }}>
                <Bot className="w-4.5 h-4.5 text-white" style={{ width: 18, height: 18 }} />
              </div>
            </div>
            <div>
              <span className="font-bold text-white text-sm tracking-wide" style={{ fontFamily: "'Syne',sans-serif", letterSpacing: ".08em" }}>
                AI<span style={{ color: "#60a5fa" }}>RECRUITER</span>
              </span>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest -mt-0.5">Powered by Vapi</div>
            </div>
          </div>

          {/* Centre — question progress (only after mic check) */}
          {isMicChecked && (
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Question</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalQuestions }).map((_, i) => (
                  <div key={i} className="h-1.5 w-6 rounded-full transition-all duration-500"
                    style={{
                      background: i < currentQuestionIndex
                        ? "linear-gradient(90deg,#3b82f6,#60a5fa)"
                        : "rgba(255,255,255,.08)"
                    }} />
                ))}
              </div>
              <span className="text-[10px] text-slate-400">{currentQuestionIndex}/{totalQuestions}</span>
            </div>
          )}

          {/* Right badges */}
          <div className="flex items-center gap-3">
            {activeUser && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)" }}>
                <Clock className="w-3 h-3 text-green-400" />
                <span className="text-[11px] font-mono text-green-400 font-bold">{fmtTime(elapsedSecs)}</span>
              </div>
            )}
            <div className="badge-live flex items-center gap-2 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.2)" }}>
              <div className="live-dot flex items-center gap-[3px]">
                <span /><span /><span />
              </div>
              <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Live</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}>
              <Shield className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">Secure</span>
            </div>
          </div>
        </header>

        {/* ══ MAIN ══ */}
        <main className="main-anim flex-1 relative z-10 flex flex-col items-center justify-center px-4 md:px-16 overflow-hidden">

          {!isMicChecked ? (
            /* Mic test — centred floating card */
            <div className="relative w-full max-w-md">
              {/* Card glow */}
              <div className="absolute inset-0 rounded-3xl blur-2xl -z-10"
                style={{ background: "rgba(37,99,235,.15)", transform: "scale(1.1)" }} />
              <div className="scan-wrap rounded-3xl overflow-hidden"
                style={{ border: "1px solid rgba(255,255,255,.08)", background: "rgba(2,8,23,.6)", backdropFilter: "blur(30px)" }}>
                <MicTest onMicReady={() => setIsMicChecked(true)} />
              </div>
            </div>
          ) : (
            /* Interview interface */
            <div className="w-full max-w-5xl h-full flex flex-col justify-center py-6">
              {/* Top mini progress bar */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest">
                  <span>Session Progress</span>
                  <span className="text-blue-400 font-bold">{progressPercentage}%</span>
                </div>
                <div className="h-px w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.06)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${progressPercentage}%`,
                      background: "linear-gradient(90deg,#1d4ed8,#60a5fa,#38bdf8)",
                      boxShadow: "0 0 12px rgba(96,165,250,.6)"
                    }} />
                </div>
              </div>

              <InterviewInterface
                interviewInfo={interviewInfo}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={totalQuestions}
                activeUser={activeUser}
              />
            </div>
          )}
        </main>

        {/* ══ FOOTER ══ */}
        {isMicChecked && (
          <footer className="footer-anim relative z-20 shrink-0 px-6 md:px-16 py-4"
            style={{
              borderTop: "1px solid rgba(255,255,255,.06)",
              background: "rgba(2,8,23,.8)",
              backdropFilter: "blur(24px)",
            }}>

            {/* Volume visualiser strip */}
            {activeUser && (
              <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
                <div className="h-full transition-all duration-75"
                  style={{
                    width: `${Math.min(100, volume * 400)}%`,
                    background: "linear-gradient(90deg,#3b82f6,#60a5fa,#38bdf8)",
                    boxShadow: "0 0 8px rgba(96,165,250,.8)",
                  }} />
              </div>
            )}

            <InterviewControls
              loading={loading}
              activeUser={activeUser}
              onStop={() => { console.log("🛑 Manual stop"); vapi.current?.stop(); }}
              volume={volume}
              startTimer={startTimer}
              resetTimer={resetTimer}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
            />
          </footer>
        )}
      </div>
    </>
  );
}

export default StartInterview;