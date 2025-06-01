export function getApiUrl() {
	const apiUrl = import.meta.env.VITE_API_URL;
	if (!apiUrl) {
		return "";
	}
	return apiUrl;
}
