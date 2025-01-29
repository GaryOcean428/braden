import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import RecruitmentPage from "./pages/recruitment";
import ApprenticeshipsPage from "./pages/apprenticeships";
import TraineeshipsPage from "./pages/traineeships";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/recruitment" element={<RecruitmentPage />} />
          <Route path="/apprenticeships" element={<ApprenticeshipsPage />} />
          <Route path="/traineeships" element={<TraineeshipsPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;