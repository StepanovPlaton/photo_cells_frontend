import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/main/main";
import AuthPage from "./pages/auth/auth";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainPage />} />
				<Route path="/auth" element={<AuthPage />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
