import { useEffect, useState } from "react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

// Fetches an active stream video call instance by its string ID
export const useActiveMeeting = (meetingId: string | string[]) => {
  const [meetingCall, setMeetingCall] = useState<Call>();
  const [isSearching, setIsSearching] = useState(true);
  
  const clientInstance = useStreamVideoClient();

  useEffect(() => {
    if (!clientInstance || !meetingId) return;

    const findActiveSession = async () => {
      try {
        const { calls } = await clientInstance.queryCalls({
          filter_conditions: { id: meetingId },
        });

        if (calls.length > 0) {
          setMeetingCall(calls[0]);
        } else {
          setMeetingCall(undefined);
        }
      } catch (err) {
        console.error("Error query for active stream call:", err);
        setMeetingCall(undefined);
      } finally {
        setIsSearching(false);
      }
    };

    findActiveSession();
  }, [clientInstance, meetingId]);

  return { meetingCall, isSearching };
};

export default useActiveMeeting;
