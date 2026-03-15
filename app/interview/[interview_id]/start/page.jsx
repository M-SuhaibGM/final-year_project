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
import { AlertCircle, Bot } from "lucide-react";

function StartInterview() {
  const { interviewInfo } = useContext(InterviewDataContext);
  const [activeUser, setActiveUser] = useState(false);
  const [conversation, setConversation] = useState();
  const vapi = useRef();
  const [hasInterviewStarted, setHasInterviewStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [resetTimer, setResetTimer] = useState(false);
  const [config, setConfig] = useState({ language: "en-US", voiceId: "jennifer" });
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);
  const [exitReason, setExitReason] = useState("Tab Closed/Interrupted"); // Default reason
  const [isMicChecked, setIsMicChecked] = useState(false);
  const [volume, setVolume] = useState(0);
  const { interview_id } = useParams();
  const router = useRouter();





  // 1. Fetch the user's saved voice/language preferences
  useEffect(() => {
    const fetchUserConfig = async () => {
      try {
        const res = await axios.get("/api/user-config");
        if (res.data) {
          setConfig({
            language: res.data.language || "en-US",
            voiceId: res.data.voiceId || "jennifer"
          });
        }
      } catch (error) {
        console.error("Using default config due to error:", error);
      } finally {
        setIsConfigLoaded(true);
      }
    };
    fetchUserConfig();
  }, [])

  const totalQuestions = interviewInfo?.interviewData?.questions?.length || 5;

  const handleMicReady = () => {
    setIsMicChecked(true);
  };

  const currentQuestionIndex = useMemo(() => {
    if (!conversation) return 1;
    try {
      const logs = JSON.parse(conversation);
      const assistantMessages = logs.filter(msg => msg.role === 'assistant' || msg.role === 'bot');
      return Math.min(assistantMessages.length + 1, totalQuestions);
    } catch (e) { return 1; }
  }, [conversation, totalQuestions]);

  // Calculate actual progress percentage

  const progressPercentage = useMemo(() => {
    return Math.round((currentQuestionIndex / totalQuestions) * 100);
  }, [currentQuestionIndex, totalQuestions]);




  useEffect(() => {
    if (!interviewInfo || hasInterviewStarted || !isMicChecked || !isConfigLoaded) return;
    vapi.current = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);

    vapi.current.on("message", (message) => {
      if (message?.type === "transcript" || message?.conversation) {
        setConversation(JSON.stringify(message.conversation || message.transcript));
      }
    });

    vapi.current.on("call-start", () => setActiveUser(true));
    vapi.current.on("speech-start", () => {
      toast.success("Interview has started!");
      setStartTimer(false);
      setResetTimer(true);
    });
    vapi.current.on("volume-level", (level) => {
      setVolume(level);
    });
    vapi.current.on("speech-end", () => {
      setStartTimer(true);
      setResetTimer(false);
    });
    vapi.current.on("call-end", () => {
      const finalReason = currentQuestionIndex >= totalQuestions ? "Interview Completed Normally" : "User Ended Early";
      setExitReason(finalReason);
      toast.success("Interview has ended!");
      setActiveUser(false);
      GenerateFeedback(finalReason, progressPercentage);
    });

    if (interviewInfo?.interviewData?.questions?.length) {
      startCall();
      setHasInterviewStarted(true);
    }
  }, [interviewInfo, isMicChecked, isConfigLoaded, currentQuestionIndex]);


  // 3. Dynamic startCall using DB values
  const startCall = () => {
    let questionList = interviewInfo?.interviewData?.questions.map((q, i) => `${i + 1}. ${q.question}`).join("\n");

    // Determine dynamic first message based on language
    let welcomeMsg = `Hi ${interviewInfo?.userName}! Ready to start?`;
    if (config.language.startsWith("hi")) welcomeMsg = `नमस्ते ${interviewInfo?.userName}! क्या आप साक्षात्कार शुरू करने के लिए तैयार हैं?`;
    if (config.language.startsWith("ur")) welcomeMsg = `اسلام و علیکم ${interviewInfo?.userName}! کیا آپ انٹرویو کے لیے تیار ہیں؟`;

    vapi.current.start({
      name: "AI Recruiter",
      firstMessage: welcomeMsg,
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: config.language // FROM DB
      },
      voice: {
        provider: config.voiceId === "hindi-female-1" ? "azure" : "playht", // Provider logic
        voiceId: config.voiceId // FROM DB
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are an AI recruiter. Strictly conduct the interview in the language: ${config.language}. Ask these questions one by one: ${questionList}.  Wait for the user to answer before moving to the next question.`
          }
        ],
      },
    });
  };
  /** * UPDATED: Using API Route + Prisma
   */
  const GenerateFeedback = async (finalReason, finalProgress) => {
    setLoading(true);
    try {
      const aiResponse = await axios.post("/api/ai-feedback", { conversation });
      let feedbackData = aiResponse.data;

      const parsedFeedback = typeof feedbackData === 'string'
        ? JSON.parse(feedbackData.replace(/```json|```/gi, "").trim())
        : feedbackData;

      // SENDING DYNAMIC FRONTEND DATA TO BACKEND
      await axios.post("/api/interview-feedback", {
        userName: interviewInfo?.userName,
        userEmail: interviewInfo?.userEmail,
        interviewId: interview_id,
        feedback: parsedFeedback,
        exitReason: finalReason,
        progressAtExit: finalProgress,
        completionStatus: finalProgress === 100 ? "Success" : "Incomplete"
      });

      router.replace(`/interview/${interview_id}/completed`);
    } catch (error) {
      console.error("Feedback Generation Error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col relative bg-slate-800 text-white">
      {/* 1. ANIMATED BACKGROUND GRADIENT */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/30 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-950/40 blur-[120px] rounded-full"></div>
      </div>

      {/* 2. HEADER */}
      <header className="h-16 shrink-0 border-b border-white/10 bg-blue-100 backdrop-blur-xl flex items-center justify-between px-8 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-black text-lg tracking-tight text-white uppercase">
            AI <span className="text-blue-500">Recruiter</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">
            Session Active
          </span>
        </div>
      </header>

      {/* 3. MAIN INTERFACE (CENTER) */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 md:px-20 overflow-hidden">
        {!isMicChecked ? (
          <div className="glass-card p-10 rounded-[2rem] bg-blue-600 border border-white/10 backdrop-blur-2xl flex flex-col items-center">
            <MicTest onMicReady={handleMicReady} />
          </div>
        ) : (
          <div className="w-full max-w-5xl h-full flex flex-col justify-center py-6">
            <InterviewInterface
              interviewInfo={interviewInfo}
              currentQuestionIndex={currentQuestionIndex}
              totalQuestions={totalQuestions}
              activeUser={activeUser}
            />
          </div>
        )}
      </main>
      {isMicChecked && (
        < footer className="h-28 shrink-0 bg-blue-100 backdrop-blur-2xl border-t border-white/10 px-8 md:px-20 z-20">
          <InterviewControls
            loading={loading}
            activeUser={activeUser}
            onStop={() => vapi.current?.stop()}
            volume={volume}
            startTimer={startTimer}
            resetTimer={resetTimer}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
          />
        </footer>)
      }
    </div >
  );
}

export default StartInterview;