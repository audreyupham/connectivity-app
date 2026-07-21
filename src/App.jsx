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

        {/* Pages WITHOUT layout */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Pages WITH layout */}
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



      </Routes>
    </Router>
  );
}
