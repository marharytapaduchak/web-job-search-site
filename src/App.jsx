import { Routes, Route } from 'react-router-dom';
import Header from "./components/Header";

import UsefulMaterials from "./pages/UsefulMaterials";
import SavedMaterials from "./pages/SavedMaterials";
import MaterialArticle from "./pages/MaterialArticle";

import FeedbackHistory from "./pages/FeedbackHistory";
import FeedbackDetails from "./pages/FeedbackDetails";

import ProfilePage from './pages/ProfilePage';
import MainVacancies from './pages/MainVacancies';
import ProfileContacts from './pages/ProfileContacts';
import ProfileNotification from './pages/ProfileNotification';
import ProfileEditInfo from './pages/ProfileEditInfo';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainVacancies />} />

        <Route path="/feedback_history" element={<FeedbackHistory />} />
        <Route path="/feedback_history/:id" element={<FeedbackDetails />} />

        <Route path="/useful_materials" element={<UsefulMaterials />} />
        <Route path="/useful_materials/saved" element={<SavedMaterials />} />
        <Route path="/useful_materials/article/:id" element={<MaterialArticle />} />

        <Route path="/profile_page" element={<ProfilePage />} />
        <Route path="/profile_contacts" element={<ProfileContacts />} />
        <Route path="/profile_notification" element={<ProfileNotification />} />
        <Route path="/profile_edit_info" element={<ProfileEditInfo />} />
      </Routes>
    </>
  );
}

export default App;