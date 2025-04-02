import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./utils/auth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import UserPermissions from './pages/UserPermissions';

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // Show nothing while checking authentication
  if (loading) return null;
  
  // Redirect to login if not authenticated
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

// Public only route (redirects to dashboard if logged in)
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  // Show nothing while checking authentication
  if (loading) return null;
  
  // Redirect to dashboard if already authenticated
  if (user) return <Navigate to="/dashboard" replace />;
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Public routes - only accessible when logged out */}
    <Route 
      path="/login" 
      element={
        <PublicOnlyRoute>
          <Login />
        </PublicOnlyRoute>
      } 
    />
    <Route 
      path="/register" 
      element={
        <PublicOnlyRoute>
          <Register />
        </PublicOnlyRoute>
      } 
    />
    
    {/* Protected routes - require authentication */}
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/settings" 
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } 
    />
    <Route path="/permissions" element={
      <ProtectedRoute>
        <UserPermissions />
      </ProtectedRoute>
    } />
    
    {/* Redirect root to dashboard if logged in, otherwise to login */}
    <Route 
      path="/" 
      element={<Navigate to="/dashboard" replace />} 
    />
    
    {/* Not found route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
