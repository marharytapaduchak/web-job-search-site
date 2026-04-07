import { Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import UsefulMaterials from "./pages/UsefulMaterials";
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
        <Route path="/useful_materials" element={<UsefulMaterials />} />
        <Route path="/profile_page" element={<ProfilePage />} />
        <Route path="/profile_contacts" element={<ProfileContacts />} />
        <Route path="/profile_notification" element={<ProfileNotification />} />
        <Route path="/profile_edit_info" element={<ProfileEditInfo />} />
      </Routes>
    </>
  );
}

export default App;
