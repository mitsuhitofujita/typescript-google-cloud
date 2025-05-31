// 認証状態に応じてリダイレクト（トップページ用）
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function HomeRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    fetch("http://localhost:3000/api/auth/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      });
  }, [navigate]);
  return <div className="text-center mt-8">Checking authentication...</div>;
}
