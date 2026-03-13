"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import React, { useState, useEffect } from "react";
import FormContainer from "./_components/FormContainer";
import { Progress } from "@/components/ui/progress";
import QuestionList from "./_components/QuestionList";
import { toast } from "sonner";
import InterviewLink from "./_components/InterviewLink";
import { useSession } from "next-auth/react";
import { getUserCredits } from "@/actions/user";

function CreateInterview() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState();
  const { data: session } = useSession()
  const user = session?.user;
  const [interviewId, setInterviewId] = useState();
  const [liveCredits, setLiveCredits] = useState(0);
  const onHandleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

  };
  useEffect(() => {
    if (user?.id) {
      const fetchFreshCredits = async () => {
        const credits = await getUserCredits();
        setLiveCredits(credits);
      };
      fetchFreshCredits();
    }
  }, [user]);

  const onGoToNext = () => {
    if (liveCredits <= 0) {
      toast("Please add credits!");
      return;
    }
    if (
      !formData?.jobPosition ||
      !formData?.jobDescription ||
      !formData?.duration ||
      !formData.type
    ) {
      toast.error("Please fill all the fields");
      return;
    }
    setStep(step + 1);
  };

  const onCreateLink = (interview_id) => {
    setInterviewId(interview_id);
    setStep(step + 1);
  };

  return (
    <div className="mt-10 px-10 md:px-24 lg:px-44 xl:px-56">
      <div className="flex gap-5 items-center">
        <ArrowLeft onClick={() => router.back()} className="cursor-pointer" />
        <h2 className="font-bold text-2xl">Create New Interview</h2>
      </div>
      <Progress value={step * 33} className={"my-5"} />
      {step === 1 ? (
        <FormContainer
          onHandleInputChange={onHandleInputChange}
          GoToNext={onGoToNext}
        />
      ) : step === 2 ? (
        <QuestionList
          formData={formData}
          credits={liveCredits}
          onCreateLink={(interview_id) => onCreateLink(interview_id)}
        />
      ) : step === 3 ? (
        <InterviewLink interview_id={interviewId} formData={formData} />
      ) : null}
    </div>
  );
}

export default CreateInterview;
