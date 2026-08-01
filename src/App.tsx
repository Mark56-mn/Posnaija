import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/public/LandingPage';
import PricingPage from './pages/public/PricingPage';
import FAQPage from './pages/public/FAQPage';
import AboutPage from './pages/public/AboutPage';
import ContactPage from './pages/public/ContactPage';
import PrivacyPolicyPage from './pages/public/PrivacyPolicyPage';
import TermsPage from './pages/public/TermsPage';
import RefundPolicyPage from './pages/public/RefundPolicyPage';
import CookiePolicyPage from './pages/public/CookiePolicyPage';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import SignUpSuccessPage from './pages/auth/SignUpSuccessPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import AuthCallback from './pages/auth/AuthCallback';

import OnboardingPage from './pages/onboarding/OnboardingPage';

import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import NewSalePage from './pages/dashboard/NewSalePage';
import ProductsPage from './pages/dashboard/ProductsPage';
import SalesPage from './pages/dashboard/SalesPage';
import DebtsPage from './pages/dashboard/DebtsPage';
import CustomersPage from './pages/dashboard/CustomersPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import StaffPage from './pages/dashboard/StaffPage';
import SettingsPage from './pages/dashboard/SettingsPage';

import PublicLayout from './components/layout/PublicLayout';
import AuditorLoginPage from './pages/auth/AuditorLoginPage';
import AuditorDashboard from './pages/dashboard/AuditorDashboard';

import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    if (localStorage.getItem('lightTheme') === 'true') {
      document.body.classList.add('light-theme');
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        </Route>

        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/sign-up-success" element={<SignUpSuccessPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auditor/login" element={<AuditorLoginPage />} />
        <Route path="/auditor/dashboard" element={<AuditorDashboard />} />

        <Route path="/onboarding" element={<OnboardingPage />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="new-sale" element={<NewSalePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="debts" element={<DebtsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="staff" element={<StaffPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
