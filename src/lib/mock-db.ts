// Shared mock database for all API routes
// In production, replace this with MongoDB or your preferred database

export const mockUsers: any[] = [
  {
    id: "user_demo_123",
    name: "HR Manager",
    email: "hr@hiregen.ai",
    password: "password123", // In production, hash this
  },
];

export const mockJobs: any[] = [];

export const mockCandidates: any[] = [];

export const mockEmailLogs: any[] = [];
