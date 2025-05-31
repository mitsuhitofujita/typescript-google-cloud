// src/pages/Login.tsx
export default function Login() {
  return (
    <div>
      <h1>ログイン</h1>
      <a href={`${import.meta.env.VITE_API_URL}/api/auth/google`}>
        <button type="button">Googleでログイン</button>
      </a>
    </div>
  );
}
