import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { AuthProvider } from './context/AuthContext'
import { NutrixonProvider } from './context/NutrixonContext'
import { HomePage } from './pages/HomePage'
import { ScannerPage } from './pages/ScannerPage'
import { ProductResultsPage } from './pages/ProductResultsPage'
import { CompanyPortalPage } from './pages/CompanyPortalPage'
import { SubmitProductPage } from './pages/SubmitProductPage'
import { SubmissionTrackingPage } from './pages/SubmissionTrackingPage'
import { ReviewerDashboardPage } from './pages/ReviewerDashboardPage'
import { RegistryPage } from './pages/RegistryPage'
import { AboutPage } from './pages/AboutPage'
import { AuthPage } from './pages/AuthPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NutrixonProvider>
          <div className="min-h-screen bg-[#F5F8FC] text-slate-900">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-6">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/scanner" element={<ScannerPage />} />
                <Route path="/results" element={<ProductResultsPage />} />
                <Route
                  path="/company"
                  element={
                    <ProtectedRoute allowedRoles={['company', 'admin']}>
                      <CompanyPortalPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/submit"
                  element={
                    <ProtectedRoute allowedRoles={['company', 'admin']}>
                      <SubmitProductPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tracking"
                  element={
                    <ProtectedRoute allowedRoles={['company', 'reviewer', 'admin']}>
                      <SubmissionTrackingPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/reviewer"
                  element={
                    <ProtectedRoute allowedRoles={['reviewer', 'admin']}>
                      <ReviewerDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/registry" element={<RegistryPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </NutrixonProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
