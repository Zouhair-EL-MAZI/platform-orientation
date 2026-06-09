import api from "@/lib/api";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface DashboardData {
  user: { name: string; email: string; avatar: string | null; role: string };
  stats: {
    profile_completion: number;
    tests_completed: number;
    total_tests: number;
    recommendations: number;
  };
  top_recommendations: {
    career: string;
    category: string;
    match_score: number;
    analysis: string;
  }[];
  recent_activity: {
    type: string;
    text: string;
    time: string;
  }[];
}

export interface OrientationTest {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: number;
  status: string;
  questions_count: number;
  is_completed: boolean;
  answered_count: number;
  questions?: TestQuestion[];
}

export interface TestQuestion {
  id: number;
  test_id: number;
  question: string;
  type: "single_choice" | "text" | "scale";
  options: string[] | null;
  points: number;
  user_answer?: string | null;
}

export interface SubmitAnswerPayload {
  question_id: number;
  answer: string;
}

export interface Recommendation {
  id: number;
  match_score: number;
  ai_analysis: string;
  created_at: string;
  career: {
    id: number;
    title: string;
    description: string;
    salary_range: string;
    required_skills: string[];
    future_scope: string;
    image: string | null;
    category: string;
  };
}

export interface Career {
  id: number;
  title: string;
  description: string;
  salary_range: string;
  required_skills: string[];
  future_scope: string;
  image: string | null;
  category_id: number;
  category: { id: number; name: string };
  // Moroccan context fields (additive, nullable)
  moroccan_context?:    string | null;
  study_paths?:         string[];
  recommended_schools?: string[];
  demand_level?:        string | null;
}

export interface CareerCategory {
  id: number;
  name: string;
  description: string;
  careers_count: number;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  age: number | null;
  education_level: string | null;
  interests: string[];
  preferred_fields: string[];
  bio: string | null;
  phone: string | null;
  city: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export const getDashboard = () =>
  api.get<{ success: boolean; data: DashboardData }>("/student/dashboard");

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

export const getTests = () =>
  api.get<{ success: boolean; data: OrientationTest[] }>("/student/tests");

export const getTest = (id: number) =>
  api.get<{ success: boolean; data: OrientationTest }>(`/student/tests/${id}`);

export const submitTest = (id: number, answers: SubmitAnswerPayload[]) =>
  api.post<{ success: boolean; message: string; total_score: number; test_id: number }>(
    `/student/tests/${id}/submit`,
    { answers }
  );

export const getTestResults = (id: number) =>
  api.get(`/student/tests/${id}/results`);

// ─────────────────────────────────────────────────────────────────────────────
// Recommendations
// ─────────────────────────────────────────────────────────────────────────────

export const getRecommendations = () =>
  api.get<{ success: boolean; data: Recommendation[] }>("/student/recommendations");

export const generateRecommendations = () =>
  api.post<{ success: boolean; message: string; data: Recommendation[] }>(
    "/student/recommendations/generate"
  );

// ─────────────────────────────────────────────────────────────────────────────
// Careers
// ─────────────────────────────────────────────────────────────────────────────

export const getCareers = (params?: { search?: string; category_id?: number; skill?: string }) =>
  api.get<{ success: boolean; data: Career[] }>("/student/careers", { params });

export const getCareer = (id: number) =>
  api.get<{ success: boolean; data: Career }>(`/student/careers/${id}`);

export const getCareerCategories = () =>
  api.get<{ success: boolean; data: CareerCategory[] }>("/student/career-categories");

// ─────────────────────────────────────────────────────────────────────────────
// Chatbot
// ─────────────────────────────────────────────────────────────────────────────

export const sendChatMessage = (message: string, history: ChatMessage[]) =>
  api.post<{ success: boolean; message: string }>("/student/chat", {
    message,
    history,
  });

// ─────────────────────────────────────────────────────────────────────────────
// Profile
// ─────────────────────────────────────────────────────────────────────────────

export const getProfile = () =>
  api.get<{ success: boolean; data: UserProfile }>("/student/profile");

export const updateProfile = (data: Partial<Omit<UserProfile, "id" | "email" | "role">>) =>
  api.put<{ success: boolean; data: UserProfile }>("/student/profile", data);

export const uploadAvatar = (file: File) => {
  const form = new FormData();
  form.append("avatar", file);
  return api.post<{ success: boolean; avatar: string }>("/student/profile/avatar", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
