import { Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import UsefulMaterials from "./pages/UsefulMaterials";
import ProfilePage from './pages/ProfilePage';
import MainVacancies from './pages/MainVacancies';


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<MainVacancies />} />
        <Route path="/useful_materials" element={<UsefulMaterials />} />
        <Route path="/profile_page" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
