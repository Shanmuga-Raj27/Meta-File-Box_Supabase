import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import Layout from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import UploadPage from './pages/UploadPage';
import PreviewPage from './pages/PreviewPage';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route
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
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
