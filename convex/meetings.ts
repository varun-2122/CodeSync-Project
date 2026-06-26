import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Fetches the global registry of scheduled and historical meetings
export const fetchMeetingsList = query({
  handler: async (ctx) => {
    const sessionToken = await ctx.auth.getUserIdentity();
    if (!sessionToken) {
      throw new Error("Unauthorized: Access token missing or expired.");
    }

    return await ctx.db.query("interviews").collect();
  },
});

// Queries meetings assigned to the currently authenticated candidate
export const fetchMyMeetings = query({
  handler: async (ctx) => {
    const sessionToken = await ctx.auth.getUserIdentity();
    if (!sessionToken) {
      return [];
    }

    const matchedList = await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) =>
        q.eq("candidateId", sessionToken.subject)
      )
      .collect();

    return matchedList ?? [];
  },
});

// Retrieves single meeting document using Stream call identifier
export const fetchMeetingByCallId = query({
  args: { streamCallId: v.string() },
  handler: async (ctx, args) => {
    if (!args.streamCallId) return null;

    return await ctx.db
      .query("interviews")
      .withIndex("by_stream_call_id", (q) =>
        q.eq("streamCallId", args.streamCallId)
      )
      .first();
  },
});

// Mutation to commit a new scheduled meeting record
export const scheduleMeeting = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
  },
  handler: async (ctx, input) => {
    const sessionToken = await ctx.auth.getUserIdentity();
    if (!sessionToken) {
      throw new Error("Unauthorized: Session is required to schedule.");
    }

    const { title, description, startTime, status, streamCallId, candidateId, interviewerIds } = input;

    return await ctx.db.insert("interviews", {
      title,
      description,
      startTime,
      status,
      streamCallId,
      candidateId,
      interviewerIds,
    });
  },
});

// Mutation to update status of a meeting, saving end stamp on completed
export const changeMeetingStatus = mutation({
  args: {
    id: v.id("interviews"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const changes: { status: string; endTime?: number } = {
      status: args.status,
    };

    if (args.status === "completed") {
      changes.endTime = Date.now();
    }

    return await ctx.db.patch(args.id, changes);
  },
});
