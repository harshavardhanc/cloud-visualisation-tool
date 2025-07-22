import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import ImprovedOnboarding from "./pages/ImprovedOnboarding";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import Dashboard from "./pages/Dashboard";
import Resources from "./pages/Resources";
import ResourceDetail from "./pages/ResourceDetail";
import NotFound from "./pages/NotFound";
import { DebugState } from "./components/DebugState";

const queryClient = new QueryClient();

function AppContent() {
  const { state } = useApp();

  // Show loading screen until app is initialized
  if (!state.isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading CloudViz...</p>
        </div>
      </div>
    );
  }

  console.log("App state:", { isOnboarded: state.isOnboarded, accountsCount: state.accounts.length });

  return (
    <Routes>
      {!state.isOnboarded ? (
        <Route path="*" element={<ImprovedOnboarding />} />
      ) : (
        <>
          <Route path="/" element={<EnhancedDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:id" element={<ResourceDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </>
      )}
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
