import api from "@/lib/api";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  tests: number;
  status: string;
  academic_level?: string | null;
  verified: boolean;
  joined: string;
  joined_human?: string;
  lastActive: string;
  profile?: {
    age?: number | null;
    city?: string | null;
    education_level?: string | null;
    academic_level?: string | null;
    statut?: string | null;
    bio?: string | null;
    interests?: string[];
    preferred_fields?: string[];
    phone?: string | null;
  };
  completed_tests?: Array<{
    title: string;
    total_score: number | string;
    completed_at: string;
  }>;
  recommendations?: Array<{
    career: string;
    match_score: number;
    created_at: string;
  }>;
}

export interface AdminTestRaw {
  id: number;
  title: string;
  description: string;
  questions_count: number;
  duration: string;
  submissions: number;
  active: boolean;
  category: string;
}

export interface AdminTest {
  id: number;
  title: string;
  description: string;
  questions: number;
  duration: number;
  completions: number;
  active: boolean;
  category: string;
}

export const createAdminUser = (data: { name: string; email: string; password: string; role: string }) =>
  api.post<{ success: boolean; data: AdminUser }>("/admin/users", data);

export interface AdminCareer {
  id: number;
  title: string;
  description: string;
  salary_range: string;
  demand_level: string;
  required_skills: string[];
  future_scope: string;
  category_id: number;
  category: { id: number; name: string };
}

export const getAdminCareers = (params?: { search?: string }) =>
  api.get<{ success: boolean; data: AdminCareer[] }>("/admin/careers", { params });

export const getAdminCareerCategories = () =>
  api.get<{ success: boolean; data: { id: number; name: string }[] }>("/admin/career-categories");

export const createAdminCareer = (data: Partial<AdminCareer>) =>
  api.post<{ success: boolean; data: AdminCareer }>("/admin/careers", data);

export const updateAdminCareer = (id: number, data: Partial<AdminCareer>) =>
  api.put<{ success: boolean; data: AdminCareer }>(`/admin/careers/${id}`, data);

export const deleteAdminCareer = (id: number) =>
  api.delete<{ success: boolean }>(`/admin/careers/${id}`);

export const getAdminUsers = (params?: { search?: string; role?: string; status?: string; academic_level?: string; page?: number; per_page?: number }) =>
  api.get<{ success: boolean; data: any }>("/admin/users", { params });

export const getAdminUserById = (id: number) =>
  api.get<{ success: boolean; data: AdminUser }>(`/admin/users/${id}`);

export const updateAdminUser = (id: number, data: { name?: string; email?: string; role?: string; status?: string }) =>
  api.put<{ success: boolean; data: AdminUser }>(`/admin/users/${id}`, data);

export const deleteAdminUser = (id: number) =>
  api.delete<{ success: boolean }>(`/admin/users/${id}`);

export const exportAdminUsers = () =>
  api.get<Blob>("/admin/users/export/csv", { responseType: "blob" });

export const getAdminTests = () =>
  api.get<{ success: boolean; data: AdminTestRaw[] }>("/admin/tests");

export const createAdminTest = (data: { title: string; description?: string; category: string; duration?: number }) =>
  api.post<{ success: boolean; data: AdminTestRaw }>("/admin/tests", data);

export const updateAdminTest = (id: number, data: { title?: string; description?: string; category?: string; duration?: number }) =>
  api.put<{ success: boolean; data: AdminTestRaw }>(`/admin/tests/${id}`, data);

export const deleteAdminTest = (id: number) =>
  api.delete<{ success: boolean }>(`/admin/tests/${id}`);

export const updateAdminTestStatus = (id: number, status: string) =>
  api.put<{ success: boolean }>(`/admin/tests/${id}/status`, { status });

export interface AdminQuestion {
  id: number;
  question: string;
  type: string;
  options: string[] | null;
  points: number;
}

export const getAdminTestQuestions = (testId: number) =>
  api.get<{ success: boolean; data: AdminQuestion[] }>(`/admin/tests/${testId}/questions`);

export const createAdminQuestion = (testId: number, data: { question: string; type: string; options?: string[]; points?: number }) =>
  api.post<{ success: boolean; data: AdminQuestion }>(`/admin/tests/${testId}/questions`, data);

export const updateAdminQuestion = (testId: number, qid: number, data: { question?: string; type?: string; options?: string[]; points?: number }) =>
  api.put<{ success: boolean; data: AdminQuestion }>(`/admin/tests/${testId}/questions/${qid}`, data);

export const deleteAdminQuestion = (testId: number, qid: number) =>
  api.delete<{ success: boolean }>(`/admin/tests/${testId}/questions/${qid}`);

// Recommendations
export interface AdminRecommendation {
  id: number;
  user: string;
  email: string;
  recommendations: string[];
  topScore: number;
  testDate: string;
  status: string;
  reviewed: boolean;
  created_at?: string;
}

export const getAdminRecommendations = (params?: { search?: string }) =>
  api.get<{ success: boolean; data: AdminRecommendation[] }>("/admin/recommendations", { params });

export const regenerateAdminRecommendations = () =>
  api.post<{ success: boolean }>("/admin/recommendations/regenerate");