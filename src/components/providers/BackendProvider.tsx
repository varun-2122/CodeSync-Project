"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";

function getConvexUrl(): string {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
    return url;
  }
  return "https://dummy-placeholder.convex.cloud";
}

const clientInstance = new ConvexReactClient(getConvexUrl());

function getClerkPublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (key && (key.startsWith("pk_test_") || key.startsWith("pk_live_"))) {
    return key;
  }
  return "pk_test_ZHVteS1rZXktOTguY2xlcmsuYWNjb3VudHMuZGV2JA==";
}

// Wrapper provider enabling Clerk authentication and Convex data sync queries
export function BackendProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={getClerkPublishableKey()}
    >
      <ConvexProviderWithClerk client={clientInstance} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default BackendProvider;
