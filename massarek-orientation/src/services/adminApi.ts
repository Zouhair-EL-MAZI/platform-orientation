import api from "@/lib/api";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminStats {
  total_students: number;
  active_students: number;
  completed_tests: number;
  total_careers: number;
  total_recommendations: number;
  total_tests: number;
}

export interface TrendPoint { date: string; count: number }
export interface CareerStat  { career: string; count: number; avg_score?: number }

export interface AdminDashboardData {
  stats: AdminStats;
  charts: {
    submissions_trend:        TrendPoint[];
    registrations_trend:      TrendPoint[];
    top_recommended_careers:  CareerStat[];
  };
  recent_activity: { type: string; text: string; time: string; email?: string }[];
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string | null;
  verified: boolean;
  tests_completed: number;
  recommendations_count: number;
  city: string | null;
  education_level: string | null;
  joined: string;
  joined_human: string;
}

export interface AdminUserDetail extends AdminUser {
  profile: {
    age: number | null;
    city: string | null;
    education_level: string | null;
    bio: string | null;
    interests: string[];
    preferred_fields: string[];
  } | null;
  completed_tests: { title: string; total_score: number; completed_at: string }[];
  recommendations: { career: string; match_score: number; created_at: string }[];
}

export interface AdminCareer {
  id: number;
  title: string;
  description: string;
  salary_range: string;
  required_skills: string[];
  future_scope: string;
  moroccan_context: string | null;
  study_paths: string[];
  recommended_schools: string[];
  demand_level: string | null;
  image: string | null;
  category_id: number;
  category: { id: number; name: string } | null;
  recommendations_count: number;
  created_at: string;
}

export interface AdminCareerCategory {
  id: number;
  name: string;
  description: string;
  careers_count: number;
}

export interface AdminTest {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: number;
  status: string;
  questions_count: number;
  submissions_count: number;
  created_at: string;
}

export interface AdminRecommendation {
  id: number;
  student: { name: string; email: string };
  career: { title: string; category: string };
  match_score: number;
  ai_analysis: string;
  created_at: string;
  created_human: string;
}

export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export const getAdminDashboard = () =>
  api.get<{ success: boolean; data: AdminDashboardData }>("/admin/dashboard");

// ─────────────────────────────────────────────────────────────────────────────
// Users
// ─────────────────────────────────────────────────────────────────────────────

export const getAdminUsers = (params?: {
  search?: string;
  status?: string;
  role?: string;
  per_page?: number;
  page?: number;
}) => api.get<{ success: boolean; data: AdminUser[]; meta: PaginationMeta }>("/admin/users", { params });

export const getAdminUserStats = () =>
  api.get<{ success: boolean; data: { total: number; active: number; verified: number; admins: number } }>("/admin/users/stats");

export const getAdminUser = (id: number) =>
  api.get<{ success: boolean; data: AdminUserDetail }>(`/admin/users/${id}`);

// ─────────────────────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────────────────────

export const getAdminTests = () =>
  api.get<{ success: boolean; data: AdminTest[] }>("/admin/tests");

// ─────────────────────────────────────────────────────────────────────────────
// Careers
// ─────────────────────────────────────────────────────────────────────────────

export const getAdminCareers = (params?: {
  search?: string;
  category_id?: number;
  per_page?: number;
  page?: number;
}) => api.get<{ success: boolean; data: AdminCareer[]; meta: PaginationMeta }>("/admin/careers", { params });

export const createCareer = (data: Partial<AdminCareer>) =>
  api.post<{ success: boolean; data: AdminCareer }>("/admin/careers", data);

export const updateCareer = (id: number, data: Partial<AdminCareer>) =>
  api.put<{ success: boolean; data: AdminCareer }>(`/admin/careers/${id}`, data);

export const deleteCareer = (id: number) =>
  api.delete<{ success: boolean }>(`/admin/careers/${id}`);

export const getAdminCareerCategories = () =>
  api.get<{ success: boolean; data: AdminCareerCategory[] }>("/admin/career-categories");

export const createCareerCategory = (name: string, description?: string) =>
  api.post<{ success: boolean; data: AdminCareerCategory }>("/admin/career-categories", { name, description });

// ─────────────────────────────────────────────────────────────────────────────
// Recommendations
// ─────────────────────────────────────────────────────────────────────────────

export const getAdminRecommendations = (params?: {
  search?: string;
  from?: string;
  to?: string;
  per_page?: number;
  page?: number;
}) => api.get<{
  success: boolean;
  data: AdminRecommendation[];
  meta: PaginationMeta;
  analytics: { top_careers: CareerStat[]; total: number; avg_score: number };
}>("/admin/recommendations", { params });

// ─────────────────────────────────────────────────────────────────────────────
// Analytics
// ─────────────────────────────────────────────────────────────────────────────

export interface AnalyticsKpi {
  total_students:  number;
  total_subs:      number;
  avg_test_score:  number;
  total_recs:      number;
  avg_match_score: number;
  wow_students:    number;
}

export interface AnalyticsData {
  kpi: AnalyticsKpi;
  charts: {
    registrations_30d: TrendPoint[];
    submissions_30d:   TrendPoint[];
    test_performance:  { test: string; submissions: number; avg_score: number }[];
    top_careers:       { career: string; category: string; count: number; avg_score: number }[];
    by_education:      { level: string; count: number }[];
    by_city:           { city: string; count: number }[];
  };
}

export const getAdminAnalytics = () =>
  api.get<{ success: boolean; data: AnalyticsData }>("/admin/analytics");
