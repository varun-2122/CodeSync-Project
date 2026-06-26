"use client";

import { ReactNode, useEffect, useState } from "react";
import { StreamVideoClient, StreamVideo } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { Loader } from "../common/Loader";
import { getStreamToken } from "@/actions/streamAuth";

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user: clerkUser, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !clerkUser) return;

    const setupStreamClient = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY!,
      user: {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.username || clerkUser.id,
        image: clerkUser.imageUrl,
      },
      tokenProvider: getStreamToken,
    });

    setVideoClient(setupStreamClient);

    return () => {
      setupStreamClient.disconnectUser();
    };
  }, [clerkUser, isLoaded]);

  if (!videoClient) {
    return <Loader />;
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default VideoProvider;
