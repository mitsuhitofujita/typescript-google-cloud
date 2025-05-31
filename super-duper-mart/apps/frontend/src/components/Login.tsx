// src/pages/Login.tsx
export default function Login() {
  return (
    <div>
      <h1>ログイン</h1>
      <a href="http://localhost:3000/api/auth/google">
        <button type="button">Googleでログイン</button>
      </a>
    </div>
  );
}
