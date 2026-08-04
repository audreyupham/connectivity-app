import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";

import ContactsPage from "./pages/ContactsPage";
import CreateNewPage from "./pages/CreateNewPage";
import AISearchPage from "./pages/AISearchPage";
import ProfileSettingsPage from "./pages/ProfileSettingsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ExpandedContactPage from "./pages/ExpandedContactPage";
import ContactDetailsLayout from "./components/ContactDetailsLayout/ContactDetailsLayout";

export default function App() {
  return (
    <Router>
      <Routes>

        {/* Default route */}
        <Route path="/" element={<LoginPage />} />

        <Route
          path="/contacts"
          element={
            <Layout>
              <ContactsPage />
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
            path="/login"
            element={
              <Login-Layout>
                <LoginPage />
              </Login-Layout>
            }
        />

        <Route
            path="/signup"
            element={
              <Login-Layout>
                <SignupPage />
              </Login-Layout>
            }
        />

      </Routes>
    </Router>
  );
}
