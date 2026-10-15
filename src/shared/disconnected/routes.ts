export const workspacePages = {
  signin: `Sign In`, signup: `Sign Up`, 'reset-password': `Reset Password`, profile: `Profile`, connections: `Connections`,
  saved: `Saved Entries`, collections: `Collections`, settings: `Settings`, dashboard: `Dashboard`, users: `Users`, content: `Content`,
  analytics: `Analytics`, health: `Health`, features: `Features`, feedback: `Feedback`, submissions: `Submissions`, guidelines: `Submission Guidelines`,
} as const;
export type WorkspacePage = keyof typeof workspacePages;
export const adminPages: WorkspacePage[] = [`dashboard`, `users`, `content`, `analytics`, `health`, `features`, `feedback`, `submissions`];
export const accountPages: WorkspacePage[] = [`profile`, `connections`, `saved`, `collections`, `settings`];
