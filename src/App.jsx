import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import AuthPage from "./pages/AuthPage"
import DoctorHome from "./pages/DoctorHome"
import AdminDashboard from "./pages/AdminDashboard"
import SearchPage from "./pages/SearchPage"
import SearchResults from "./pages/SearchResults"
import ComparePage from "./pages/ComparePage"
import HerbLibrary from "./pages/HerbLibrary"
import HerbDetailPage from "./pages/HerbDetailPage"
import FavoritesPage from "./pages/FavoritesPage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import LanguagePage from "./pages/LanguagePage"
import UpgradePlanPage from "./pages/UpgradePlanPage"
import LearnMorePage from "./pages/LearnMorePage"
import ManageHerbs from "./pages/ManageHerbs"
import AdminLayout from "./components/AdminLayout"
import AddHerb from "./pages/AddHerb"
import VocabularyManagement from "./pages/VocabularyManagement"
import ScoringConfiguration from "./pages/ScoringConfiguration"
import SearchAnalytics from "./pages/SearchAnalytics"
import UserRoleManagement from "./pages/UserRoleManagement"
import AuditLog from "./pages/AuditLog"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* Doctor Dashboard */}
        <Route path="/doctor" element={<DoctorHome />} />
       {/* Admin Dashboard */}
       <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<AdminDashboard />} />
           <Route path="manage-herbs" element={<ManageHerbs />} />
           <Route path="add-herb" element={<AddHerb />} />
           <Route path="vocabulary" element={<VocabularyManagement />} />
           <Route path="scoring" element={<ScoringConfiguration />} />
           <Route path="search-analytics" element={<SearchAnalytics />} />
           <Route path="users" element={<UserRoleManagement />} />
           <Route path="audit-log" element={<AuditLog />} />
      </Route>

        {/* Search */}
        <Route path="/search" element={<SearchPage />} />
        <Route path="/search-results" element={<SearchResults />} />

        {/* Herb Pages */}
        <Route path="/herb-library" element={<HerbLibrary />} />
        <Route path="/herb/:id" element={<HerbDetailPage />} />

        {/* Doctor Workspace */}
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />

        {/* Profile / Preferences */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/language" element={<LanguagePage />} />

        {/* Additional Pages */}
        <Route path="/upgrade" element={<UpgradePlanPage />} />
        <Route path="/learn-more" element={<LearnMorePage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App