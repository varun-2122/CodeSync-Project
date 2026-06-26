import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Submits a score rating and detailed commentary about a candidate's session
export const postEvaluationNote = mutation({
  args: {
    interviewId: v.id("interviews"),
    content: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const activeSession = await ctx.auth.getUserIdentity();
    if (!activeSession) {
      throw new Error("Unauthorized: Authentication is missing.");
    }

    const { interviewId, content, rating } = args;

    return await ctx.db.insert("comments", {
      interviewId,
      content,
      rating,
      interviewerId: activeSession.subject,
    });
  },
});

// Retrieves historical evaluation comments posted for a specific meeting room
export const fetchEvaluationNotes = query({
  args: { interviewId: v.id("interviews") },
  handler: async (ctx, args) => {
    if (!args.interviewId) return [];

    return await ctx.db
      .query("comments")
      .withIndex("by_interview_id", (q) =>
        q.eq("interviewId", args.interviewId)
      )
      .collect();
  },
});
