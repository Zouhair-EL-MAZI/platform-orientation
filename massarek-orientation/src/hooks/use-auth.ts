import { useState, useEffect, useCallback } from "react";

export const useAuth = () => {
  const getToken = () => localStorage.getItem("token");
  const getUser  = () => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  };
  const getRole = () => localStorage.getItem("role");

  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getToken());
  const [user, setUser]   = useState(() => getUser());
  const [loading]         = useState(false);
  const [role, setRole]   = useState<string | null>(() => getRole());

  // Sync state from localStorage — called both on storage event (other tabs)
  // AND via dispatchEvent (same tab, after login/logout)
  const sync = useCallback(() => {
    setIsAuthenticated(!!getToken());
    setUser(getUser());
    setRole(getRole());
  }, []);

  useEffect(() => {
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [sync]);

  // ── login — updates localStorage AND React state atomically ──────────────
  // Calling login() then navigate() is safe because:
  // 1. localStorage is updated synchronously
  // 2. React state is updated via setState (batched)
  // 3. AdminRoute reads localStorage.getItem("role") as fallback — always fresh
  const login = useCallback((userData: any, token: string) => {
    const role = userData?.role ?? null;
    const userWithRole = { ...userData, role };

    // Write to localStorage first — guards read this directly as fallback
    localStorage.setItem("user",  JSON.stringify(userWithRole));
    localStorage.setItem("token", token);
    localStorage.setItem("role",  role);

    // Then update React state
    setIsAuthenticated(true);
    setUser(userWithRole);
    setRole(role);

    // Dispatch storage event so any other useAuth() instances in the same
    // tab also sync (e.g. AppSidebar, Navbar)
    window.dispatchEvent(new Event("storage"));
  }, []);

  // ── logout — clears localStorage AND React state ─────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
    window.dispatchEvent(new Event("storage"));
  }, []);

  // ── refreshUser — re-reads user from localStorage (call after profile update) ──
  const refreshUser = useCallback(() => {
    setUser(getUser());
  }, []);

  return { isAuthenticated, user, role, loading, login, logout, refreshUser };
};
