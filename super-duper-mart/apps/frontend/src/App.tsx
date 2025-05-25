// apps/frontend/src/App.tsx
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css"; // これは残しても大丈夫です

function App() {
	const [count, setCount] = useState(0);

	return (
		// UnoCSS のクラスを適用
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4">
			<div className="flex gap-4 mb-8">
				<a href="https://vitejs.dev" target="_blank" rel="noreferrer">
					<img src={viteLogo} className="logo vite" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank" rel="noreferrer">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1 className="text-4xl font-bold mb-4">Vite + React</h1>
			<div className="card bg-white p-6 rounded-lg shadow-md mb-6">
				<button
					type="button"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
					onClick={() => setCount((count) => count + 1)}
				>
					count is {count}
				</button>
				<p className="read-the-docs text-sm text-gray-500 mt-4">
					Click on the Vite and React logos to learn more
				</p>
			</div>
		</div>
	);
}

export default App;
