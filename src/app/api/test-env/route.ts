import { NextResponse } from "next/server";

export async function GET() {
  const clerkPub = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
  const clerkSec = process.env.CLERK_SECRET_KEY || "";
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "";
  
  return NextResponse.json({
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: {
      length: clerkPub.length,
      prefix: clerkPub.substring(0, 12),
      suffix: clerkPub.substring(Math.max(0, clerkPub.length - 5)),
    },
    CLERK_SECRET_KEY: {
      length: clerkSec.length,
      prefix: clerkSec.substring(0, 12),
      suffix: clerkSec.substring(Math.max(0, clerkSec.length - 5)),
    },
    NEXT_PUBLIC_CONVEX_URL: {
      length: convexUrl.length,
      prefix: convexUrl.substring(0, 15),
    }
  });
}
