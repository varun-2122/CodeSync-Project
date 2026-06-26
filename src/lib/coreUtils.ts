import { clsx, type ClassValue } from "clsx";
import { addHours, intervalToDuration, isAfter, isBefore, isWithinInterval } from "date-fns";
import { twMerge } from "tailwind-merge";
import { Doc } from "../../convex/_generated/dataModel";

type MeetingRecord = Doc<"interviews">;
type UserProfile = Doc<"users">;

// Combines CSS classes cleanly using clsx and tailwind-merge
export function combineClasses(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

interface GroupedMeetings {
  succeeded?: MeetingRecord[];
  failed?: MeetingRecord[];
  completed?: MeetingRecord[];
  upcoming?: MeetingRecord[];
}

// Groups meeting list into tabs based on state and timeframe
export const groupMeetingsByStatus = (sessions: MeetingRecord[]): GroupedMeetings => {
  if (!sessions) return {};

  const currentInstant = new Date();

  return sessions.reduce<GroupedMeetings>((groups, item) => {
    const meetingTime = new Date(item.startTime);

    if (item.status === "succeeded") {
      groups.succeeded = [...(groups.succeeded || []), item];
    } else if (item.status === "failed") {
      groups.failed = [...(groups.failed || []), item];
    } else if (isBefore(meetingTime, currentInstant)) {
      groups.completed = [...(groups.completed || []), item];
    } else if (isAfter(meetingTime, currentInstant)) {
      groups.upcoming = [...(groups.upcoming || []), item];
    }

    return groups;
  }, {});
};

interface MemberDetails {
  fullName: string;
  avatarUrl: string;
  letters: string;
}

// Resolves candidate profile fields and returns user fallback details
export const resolveCandidateInfo = (usersList: UserProfile[], clerkId: string): MemberDetails => {
  const match = usersList?.find((u) => u.clerkId === clerkId);
  
  const letters = match?.name
    ? match.name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase()
    : "CD";

  return {
    fullName: match?.name || "Anonymous Candidate",
    avatarUrl: match?.image || "",
    letters,
  };
};

// Resolves interviewer details and formats display initials
export const resolveInterviewerInfo = (usersList: UserProfile[], clerkId: string): MemberDetails => {
  const match = usersList?.find((u) => u.clerkId === clerkId);
  
  const letters = match?.name
    ? match.name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase()
    : "IV";

  return {
    fullName: match?.name || "Anonymous Interviewer",
    avatarUrl: match?.image || "",
    letters,
  };
};

// Computes standard formatting for timestamps of call recordings
export const calculateTimeElapsed = (startIso: string, endIso: string): string => {
  const start = new Date(startIso);
  const end = new Date(endIso);

  const parsedDuration = intervalToDuration({ start, end });

  const hours = parsedDuration.hours || 0;
  const minutes = parsedDuration.minutes || 0;
  const seconds = parsedDuration.seconds || 0;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  if (minutes > 0) {
    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  }

  return `${seconds} seconds`;
};

// Checks dynamic time boundaries to determine if a scheduled call is actively live
export const getMeetingLiveStatus = (meeting: MeetingRecord): "completed" | "live" | "upcoming" => {
  const current = new Date();
  const start = meeting.startTime;
  const cutoff = addHours(start, 1); // 1-hour session duration limit

  if (
    meeting.status === "completed" ||
    meeting.status === "failed" ||
    meeting.status === "succeeded"
  ) {
    return "completed";
  }

  if (isWithinInterval(current, { start, end: cutoff })) {
    return "live";
  }

  if (isBefore(current, start)) {
    return "upcoming";
  }

  return "completed";
};
