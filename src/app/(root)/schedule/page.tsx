"use client";

import Loader from "@/components/common/Loader";
import { useRoleCheck } from "@/hooks/useRoleCheck";
import { useRouter } from "next/navigation";
import InterviewScheduleUI from "./InterviewScheduleUI";

function SchedulePage() {
  const routerInstance = useRouter();
  const { isInterviewer, isRoleLoading } = useRoleCheck();

  if (isRoleLoading) {
    return <Loader />;
  }

  if (!isInterviewer) {
    routerInstance.push("/");
    return null;
  }

  return <InterviewScheduleUI />;
}

export default SchedulePage;