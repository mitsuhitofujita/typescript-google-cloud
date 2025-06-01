// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApiUrl } from "../lib/env";

type User = { name: string };

export default function Dashboard() {
	const [user, setUser] = useState<User | null>(null);
	const navigate = useNavigate();
	useEffect(() => {
		fetch(`${getApiUrl()}/api/auth/me`, { credentials: "include" })
			.then((res) => res.json())
			.then((data) => {
				if (!data.authenticated) {
					navigate("/login");
				} else {
					setUser(data.user);
				}
			});
	}, [navigate]);
	if (!user) return <div>Loading...</div>;
	return <div>こんにちは, {user.name}</div>;
}
