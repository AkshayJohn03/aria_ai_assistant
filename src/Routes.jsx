import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
// Add your imports here
import MainChatInterface from "./pages/main-chat-interface";
import CouncilDeliberationView from "./pages/council-deliberation-view";
import SessionManagementDashboard from "./pages/session-management-dashboard";
import DocumentUploadAndAnalysis from "./pages/document-upload-and-analysis";
import ModelConfigurationHub from "./pages/model-configuration-hub";
import SettingsAndPreferences from "./pages/settings-and-preferences";
import NotFound from "./pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<MainChatInterface />} />
        <Route path="/main-chat-interface" element={<MainChatInterface />} />
        <Route path="/council-deliberation-view" element={<CouncilDeliberationView />} />
        <Route path="/session-management-dashboard" element={<SessionManagementDashboard />} />
        <Route path="/document-upload-and-analysis" element={<DocumentUploadAndAnalysis />} />
        <Route path="/model-configuration-hub" element={<ModelConfigurationHub />} />
        <Route path="/settings-and-preferences" element={<SettingsAndPreferences />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;