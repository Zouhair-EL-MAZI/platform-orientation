// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { ThemeProvider } from "next-themes";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { Toaster } from "@/components/ui/toaster";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import AppLayout from "./components/AppLayout";
// import MainLayout from "./components/MainLayout";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Landing from "./pages/Landing";
// import About from "./pages/About";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "@/pages/ForgotPassword";
// import ResetPassword from "@/pages/ResetPassword";
// import VerifyEmail from "@/pages/VerifyEmail";
// import Terms from "@/pages/Terms";
// import Privacy from "@/pages/Privacy";
// import Logout from "./pages/Logout";
// import Dashboard from "./pages/Dashboard";
// import Profile from "./pages/Profile";
// import TestInterface from "./pages/TestInterface";
// import Recommendations from "./pages/Recommendations";
// import CareerExplorer from "./pages/CareerExplorer";
// import Chatbot from "./pages/Chatbot";
// import AdminDashboard from "./pages/AdminDashboard";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const WithLayout = ({ children }: { children: React.ReactNode }) => (
//   <AppLayout>{children}</AppLayout>
// );

// const PublicLayout = ({ children }: { children: React.ReactNode }) => (
//   <MainLayout>{children}</MainLayout>
// );

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <Routes>
//           {/* PUBLIC ROUTES */}
//           <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/verify-email" element={<VerifyEmail />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password" element={<ResetPassword />} />
//           <Route path="/terms" element={<Terms />} />
//           <Route path="/privacy" element={<Privacy />} />
//           <Route path="/logout" element={<PublicLayout><Logout /></PublicLayout>} />
//           <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
          
//           {/* PROTECTED ROUTES */}
//           <Route path="/dashboard" element={<ProtectedRoute><WithLayout><Dashboard /></WithLayout></ProtectedRoute>} />
//           <Route path="/profile" element={<ProtectedRoute><WithLayout><Profile /></WithLayout></ProtectedRoute>} />
//           <Route path="/test" element={<ProtectedRoute><WithLayout><TestInterface /></WithLayout></ProtectedRoute>} />
//           <Route path="/recommendations" element={<ProtectedRoute><WithLayout><Recommendations /></WithLayout></ProtectedRoute>} />
//           <Route path="/careers" element={<ProtectedRoute><WithLayout><CareerExplorer /></WithLayout></ProtectedRoute>} />
//           <Route path="/chatbot" element={<ProtectedRoute><WithLayout><Chatbot /></WithLayout></ProtectedRoute>} />
//           <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><WithLayout><AdminDashboard /></WithLayout></ProtectedRoute>} />
          
//           {/* NOT FOUND */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </TooltipProvider>
//     </ThemeProvider>
//   </QueryClientProvider>
// );

// export default App;
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "./components/AppLayout";
import AdminLayout from "./layouts/AdminLayout";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Landing from "./pages/Landing";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Logout from "./pages/Logout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import TestInterface from "./pages/TestInterface";
import Recommendations from "./pages/Recommendations";
import CareerExplorer from "./pages/CareerExplorer";
import Chatbot from "./pages/Chatbot";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminTestsPage from "./pages/admin/AdminTestsPage";
import AdminCareersPage from "./pages/admin/AdminCareersPage";
import AdminRecommendationsPage from "./pages/admin/AdminRecommendationsPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";

const queryClient = new QueryClient();

const WithStudentLayout = ({ children }: { children: React.ReactNode }) => (
  <AppLayout>{children}</AppLayout>
);

const WithAdminLayout = ({ children }: { children: React.ReactNode }) => (
  <AdminLayout>{children}</AdminLayout>
);

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <MainLayout>{children}</MainLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* ─── PUBLIC ROUTES ─── */}
            <Route path="/" element={<PublicLayout><Landing /></PublicLayout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/logout" element={<PublicLayout><Logout /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />

            {/* ─── STUDENT ROUTES (role: user) ─── */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <WithStudentLayout><Dashboard /></WithStudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <WithStudentLayout><Profile /></WithStudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/test"
              element={
                <ProtectedRoute>
                  <WithStudentLayout><TestInterface /></WithStudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <WithStudentLayout><Recommendations /></WithStudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/careers"
              element={
                <ProtectedRoute>
                  <WithStudentLayout><CareerExplorer /></WithStudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chatbot"
              element={
                <ProtectedRoute>
                  <WithStudentLayout><Chatbot /></WithStudentLayout>
                </ProtectedRoute>
              }
            />

            {/* ─── ADMIN ROUTES (role: admin) ─── */}
            {/* Redirect /admin → /admin/dashboard */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Navigate to="/admin/dashboard" replace />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <WithAdminLayout><AdminDashboardPage /></WithAdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <WithAdminLayout><AdminUsersPage /></WithAdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/tests"
              element={
                <AdminRoute>
                  <WithAdminLayout><AdminTestsPage /></WithAdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/careers"
              element={
                <AdminRoute>
                  <WithAdminLayout><AdminCareersPage /></WithAdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/recommendations"
              element={
                <AdminRoute>
                  <WithAdminLayout><AdminRecommendationsPage /></WithAdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <AdminRoute>
                  <WithAdminLayout><AdminAnalyticsPage /></WithAdminLayout>
                </AdminRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <AdminRoute>
                  <WithAdminLayout><AdminSettingsPage /></WithAdminLayout>
                </AdminRoute>
              }
            />

            {/* ─── 404 ─── */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
