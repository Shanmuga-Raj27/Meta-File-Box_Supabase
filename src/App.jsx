import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import PreviewPage from './pages/PreviewPage';
import LandingPage from './pages/LandingPage';
import AuthModal from './components/AuthModal';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AuthModal />
          <Routes>
            {/* Landing Page is the new Entry point */}
            <Route path="/" element={<LandingPage />} />

            {/* All Dashboard features moved to /dashboard */}
            <Route
              path="/dashboard"
              element={
                <Layout
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              }
            >
              <Route
                index
                element={<DashboardPage searchQuery={searchQuery} />}
              />
              <Route path="upload" element={<UploadPage />} />
              <Route path="preview/:id" element={<PreviewPage />} />
            </Route>

            {/* Fallback to Landing Page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
