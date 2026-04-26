import { Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute  from "./routes/PublicRoute";

// Layout
import Navbar       from "./components/layout/Navbar";
import DashboardNav from "./components/layout/DashboardNav";

// Auth Pages
import LoginPage         from "./pages/auth/LoginPage";
import SignupPage        from "./pages/auth/SignupPage";
import OAuthCallbackPage from "./pages/auth/OAuthCallbackPage";

// Public Pages
import LandingPage  from "./pages/public/LandingPage";
import AboutPage    from "./pages/public/AboutPage";
import ServicesPage from "./pages/public/ServicesPage";
import FeaturePage from "./pages/public/FeaturePage";
import FeaturesPage  from "./pages/public/FeaturePage"; 
import PricingPage  from "./pages/public/PricingPage";

// Private Pages
import DashboardPage from "./pages/private/DashboardPage";
import ChatPage      from "./pages/private/ChatPage";
import DocumentsPage from "./pages/private/DocumentsPage";
import LibraryPage   from "./pages/private/LibraryPage";
import HistoryPage   from "./pages/private/HistoryPage";
import ProfilePage   from "./pages/private/ProfilePage";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="flex-1 ml-64">{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { pathname } = useLocation();
  const isDashboard  = [
    "/dashboard", "/chat", "/documents",
    "/library", "/history", "/profile", "/admin"
  ].some(p => pathname.startsWith(p));

  return (
    <>
      {!isDashboard && !pathname.startsWith("/auth") && <Navbar />}

      <Routes>
        {/* Public */}
        <Route path="/"         element={<LandingPage  />} />
        <Route path="/about"    element={<AboutPage    />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing"  element={<PricingPage  />} />

        {/* Auth */}
        <Route path="/login"
               element={<PublicRoute><LoginPage  /></PublicRoute>} />
        <Route path="/signup"
               element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/auth/callback"
               element={<OAuthCallbackPage />} />

        {/* Private */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardLayout><DashboardPage /></DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/chat" element={
          <PrivateRoute>
            <DashboardLayout><ChatPage /></DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/documents" element={
          <PrivateRoute>
            <DashboardLayout><DocumentsPage /></DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/library" element={
          <PrivateRoute>
            <DashboardLayout><LibraryPage /></DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/history" element={
          <PrivateRoute>
            <DashboardLayout><HistoryPage /></DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <DashboardLayout><ProfilePage /></DashboardLayout>
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <PrivateRoute>
            <DashboardLayout><AdminDashboard /></DashboardLayout>
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}