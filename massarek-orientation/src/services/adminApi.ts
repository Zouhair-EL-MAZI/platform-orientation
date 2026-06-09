import api from "@/lib/api";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  tests: number;
  status: string;
  verified: boolean;
  joined: string;
  lastActive: string;
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
  duration: string;
  completions: number;
  active: boolean;
  category: string;
}

export const getAdminUsers = (params?: { search?: string; page?: number }) =>
  api.get<{ success: boolean; data: any }>("/admin/users", { params });

export const getAdminTests = () =>
  api.get<{ success: boolean; data: AdminTestRaw[] }>("/admin/tests");

export const updateAdminTestStatus = (id: number, status: string) =>
  api.put<{ success: boolean }>(`/admin/tests/${id}/status`, { status });

export const deleteAdminUser = (id: number) =>
  api.delete<{ success: boolean }>(`/admin/users/${id}`);