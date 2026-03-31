import { Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import UsefulMaterials from "./pages/UsefulMaterials";
import ProfilePage from './pages/ProfilePage';

function HomePage() {
  return <h1>Головна сторінка</h1>;
}

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/useful_materials" element={<UsefulMaterials />} />
        <Route path="/profile_page" element={<ProfilePage />} />
      </Routes>
    </>
  );
}

export default App;
