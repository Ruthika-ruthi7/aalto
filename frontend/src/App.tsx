import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import EnquiriesListPage from './pages/enquiries/EnquiriesListPage'
import EnquiryFormPage from './pages/enquiries/EnquiryFormPage'
import BlogsListPage from './pages/blogs/BlogsListPage'
import BlogFormPage from './pages/blogs/BlogFormPage'
import CareersListPage from './pages/careers/CareersListPage'
import CareerFormPage from './pages/careers/CareerFormPage'
import ApplicantsListPage from './pages/applicants/ApplicantsListPage'
import ApplicantFormPage from './pages/applicants/ApplicantFormPage'
import GalleryListPage from './pages/gallery/GalleryListPage'
import GalleryFormPage from './pages/gallery/GalleryFormPage'
import CaseStudiesListPage from './pages/case-studies/CaseStudiesListPage'
import CaseStudyFormPage from './pages/case-studies/CaseStudyFormPage'
import UserListPage from './pages/users/UserListPage'
import UserFormPage from './pages/users/UserFormPage'
import SettingsPage from './pages/settings/SettingsPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/enquiries" element={
          <ProtectedRoute>
            <MainLayout>
              <EnquiriesListPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/enquiries/create" element={
          <ProtectedRoute>
            <MainLayout>
              <EnquiryFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/enquiries/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <EnquiryFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/enquiries/:id/edit" element={
          <ProtectedRoute>
            <MainLayout>
              <EnquiryFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/blogs" element={
          <ProtectedRoute>
            <MainLayout>
              <BlogsListPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/blogs/create" element={
          <ProtectedRoute>
            <MainLayout>
              <BlogFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/blogs/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <BlogFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/blogs/:id/edit" element={
          <ProtectedRoute>
            <MainLayout>
              <BlogFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/careers" element={
          <ProtectedRoute>
            <MainLayout>
              <CareersListPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/careers/create" element={
          <ProtectedRoute>
            <MainLayout>
              <CareerFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/careers/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <CareerFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/careers/:id/edit" element={
          <ProtectedRoute>
            <MainLayout>
              <CareerFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/applicants" element={
          <ProtectedRoute>
            <MainLayout>
              <ApplicantsListPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/applicants/create" element={
          <ProtectedRoute>
            <MainLayout>
              <ApplicantFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/applicants/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <ApplicantFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/applicants/:id/edit" element={
          <ProtectedRoute>
            <MainLayout>
              <ApplicantFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/gallery" element={
          <ProtectedRoute>
            <MainLayout>
              <GalleryListPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/gallery/create" element={
          <ProtectedRoute>
            <MainLayout>
              <GalleryFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/gallery/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <GalleryFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/gallery/:id/edit" element={
          <ProtectedRoute>
            <MainLayout>
              <GalleryFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/case-studies" element={
          <ProtectedRoute>
            <MainLayout>
              <CaseStudiesListPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/case-studies/create" element={
          <ProtectedRoute>
            <MainLayout>
              <CaseStudyFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/case-studies/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <CaseStudyFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/case-studies/new" element={
          <ProtectedRoute>
            <MainLayout>
              <CaseStudyFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/case-studies/:id/edit" element={
          <ProtectedRoute>
            <MainLayout>
              <CaseStudyFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <MainLayout>
              <SettingsPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <MainLayout>
              <UserListPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/users/create" element={
          <ProtectedRoute>
            <MainLayout>
              <UserFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/users/:id/edit" element={
          <ProtectedRoute>
            <MainLayout>
              <UserFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/users/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <UserFormPage />
            </MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
