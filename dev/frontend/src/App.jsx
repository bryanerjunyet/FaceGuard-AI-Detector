import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "@/components/NavBar";
import HomePage from "@/pages/HomePage";
import GuidePage from "@/pages/GuidePage";
import SignInPage from "@/pages/SignInPage";
import UploadPage from "@/pages/UploadPage";

export default function App() {
  return (
    <div className="app-shell">
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

