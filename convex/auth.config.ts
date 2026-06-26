/**
 * Auth configuration connecting Clerk and Convex backend.
 */
const authConfig = {
  providers: [
    {
      domain: "https://factual-polliwog-88.clerk.accounts.dev/",
      applicationID: "convex",
    },
  ],
};

export default authConfig;