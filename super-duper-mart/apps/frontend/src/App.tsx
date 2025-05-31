// apps/frontend/src/App.tsx
import "./App.css"; // これは残しても大丈夫です

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomeRedirect from "./components/HomeRedirect.tsx";
import Login from "./components/Login.tsx";
import Dashboard from "./components/Dashboard.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* それ以外はトップへ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
