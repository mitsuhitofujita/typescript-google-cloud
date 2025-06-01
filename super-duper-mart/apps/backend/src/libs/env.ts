import path from "node:path";

export function getJwtSecret(): string {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) {
		throw new Error("JWT_SECRET is not defined");
	}
	return jwtSecret;
}

export function getStaticFilesPath(): string {
	// 静的ファイルのパスを返す関数
	// __dirnameは/apps/backend/src/libsを指す
	return path.join(__dirname, "../../../frontend/dist");
}

export function getCorsOrigins(): string[] {
	const origins = process.env.CORS_ORIGINS;
	if (!origins) {
		return [];
	}
	return origins.split(",").map((origin) => origin.trim());
}
