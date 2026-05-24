import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "./components/AppLayout";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
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
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const WithLayout = ({ children }: { children: React.ReactNode }) => (
  <AppLayout>{children}</AppLayout>
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
          {/* PUBLIC ROUTES */}
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
          
          {/* PROTECTED ROUTES */}
          <Route path="/dashboard" element={<ProtectedRoute><WithLayout><Dashboard /></WithLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><WithLayout><Profile /></WithLayout></ProtectedRoute>} />
          <Route path="/test" element={<ProtectedRoute><WithLayout><TestInterface /></WithLayout></ProtectedRoute>} />
          <Route path="/recommendations" element={<ProtectedRoute><WithLayout><Recommendations /></WithLayout></ProtectedRoute>} />
          <Route path="/careers" element={<ProtectedRoute><WithLayout><CareerExplorer /></WithLayout></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><WithLayout><Chatbot /></WithLayout></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><WithLayout><AdminDashboard /></WithLayout></ProtectedRoute>} />
          
          {/* NOT FOUND */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;