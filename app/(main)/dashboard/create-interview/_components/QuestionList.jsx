"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Loader, Loader2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import QuestionListContainer from "./QuestionListContainer";
import { useSession } from "next-auth/react";

function QuestionList({ formData, onCreateLink ,credits }) {
  const { data: session, update } = useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [questionList, setQuestionList] = useState([]);

  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData]);

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/generate-questions", { ...formData });
      let content = result.data;

      // Extract JSON logic
      const match = typeof content === "string" 
        ? content.match(/```json\s*([\s\S]*?)```/i) 
        : null;
      const jsonString = match ? match[1].trim() : (typeof content === "string" ? content.trim() : JSON.stringify(content));
      
      const parsed = JSON.parse(jsonString);
      setQuestionList(parsed.interviewQuestions || []);
    } catch (error) {
      toast.error("Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    if ((credits || 0) <= 0) {
      return toast.error("You don't have enough credits.");
    }

    setSaveLoading(true);
    const interview_id = uuidv4();

    try {
      const response = await axios.post("/api/interviews", {
        ...formData,
        questions: questionList,
        interview_link: interview_id,
        type: formData.type || ["Technical"], // Ensure your formData has types
      });

      if (response.data) {
        toast.success("Interview created and credits deducted!");
        
        // Refresh the NextAuth session so the UI shows new credits
        await update(); 
        
        onCreateLink(interview_id);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to save interview";
      toast.error(errorMsg);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="p-5 bg-blue-50 rounded-xl border border-blue-200 flex gap-5 items-center">
          <Loader2Icon className="animate-spin text-blue-600" />
          <div>
            <h2 className="font-medium">Generating Interview Questions</h2>
            <p className="text-slate-500 text-sm">Our AI is crafting personalized questions...</p>
          </div>
        </div>
      )}
      
      {!loading && questionList?.length > 0 && (
        <QuestionListContainer questionList={questionList} />
      )}

      <div className="flex justify-end mt-10">
        <Button 
          onClick={onFinish} 
          disabled={saveLoading || loading || questionList.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {saveLoading ? <Loader className="animate-spin mr-2" /> : null}
          Create Interview Link & Finish
        </Button>
      </div>
    </div>
  );
}

export default QuestionList;