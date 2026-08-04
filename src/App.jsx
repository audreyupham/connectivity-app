import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginLayout from "./layout/LoginLayout";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetPasswordConfirmPage from "./pages/ResetPasswordConfirmPage";

import Layout from "./layout/Layout";
import ContactsPage from "./pages/ContactsPage";
import ExpandedContactPage from "./pages/ExpandedContactPage";
import CreateNewPage from "./pages/CreateNewPage";
import AISearchPage from "./pages/AISearchPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            <LoginLayout
              title="Login"
              links={{
                left: { to: "/reset-password", label: "Reset Password" },
                right: { to: "/signup", label: "Create Account" }
              }}
            >
              <LoginPage />
            </LoginLayout>
          }
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={
            <LoginLayout
              title="Create Account"
              links={{
                left: { to: "/reset-password", label: "Reset Password" },
                right: { to: "/login", label: "Log In" }
              }}
            >
              <SignUpPage />
            </LoginLayout>
          }
        />

        {/* RESET PASSWORD */}
        <Route
          path="/reset-password"
          element={
            <LoginLayout
              title="Reset Password"
              links={{
                left: { to: "/login", label: "Back to Login" },
                right: { to: "/signup", label: "Create Account" }
              }}
            >
              <ResetPasswordPage />
            </LoginLayout>
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            <LoginLayout
              title="Set New Password"
              links={{
                left: { to: "/login", label: "Back to Login" },
                right: { to: "/signup", label: "Create Account" }
              }}
            >
              <ResetPasswordConfirmPage />
            </LoginLayout>
          }
        />

        {/* PROTECTED ROUTES */}
        <Route
          path="/contacts"
          element={
            <Layout>
              <ContactsPage />
            </Layout>
          }
        />

        <Route
          path="/contacts/:id"
          element={
            <Layout showFloatingButton={false}>
              <ExpandedContactPage />
            </Layout>
          }
        />

        <Route
          path="/create-new"
          element={
            <Layout>
              <CreateNewPage />
            </Layout>
          }
        />

        <Route
          path="/ai-search"
          element={
            <Layout>
              <AISearchPage />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <ProfileSettingsPage />
            </Layout>
          }
        />

        {/* DEFAULT ROUTE */}
        <Route
          path="/"
          element={
            <LoginLayout
              title="Login"
              links={{
                left: { to: "/reset-password", label: "Reset Password" },
                right: { to: "/signup", label: "Create Account" }
              }}
            >
              <LoginPage />
            </LoginLayout>
          }
        />

      </Routes>
    </Router>
  );
}