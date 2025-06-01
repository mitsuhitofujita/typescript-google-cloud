// src/pages/Login.tsx
import { getApiUrl } from "../lib/env";

export default function Login() {
	return (
		<div>
			<h1>ログイン</h1>
			<a href={`${getApiUrl()}/api/auth/google`}>
				<button type="button">Googleでログイン</button>
			</a>
		</div>
	);
}
