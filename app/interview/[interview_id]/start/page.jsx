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
import { AlertCircle } from "lucide-react";

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
    <div className="p-10 lg:px-48 xl:px-56">
      {!isMicChecked ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <MicTest onMicReady={handleMicReady} />
          <p className="mt-5 text-gray-400 text-xs flex items-center gap-2">
            <AlertCircle className="h-3 w-3" />
            Your audio is only used for the interview and is not stored during this test.
          </p>
        </div>
      ) : (
        <>
          <InterviewInterface
            volume={volume}
            interviewInfo={interviewInfo}
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            activeUser={activeUser}
            startTimer={startTimer}
            resetTimer={resetTimer}
          />

          <InterviewControls
            loading={loading}
            activeUser={activeUser}
            onStop={() => vapi.current?.stop()}
          />
        </>
      )}
    </div>
  );
}

export default StartInterview;