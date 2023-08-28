import React, { useRef, useState } from "react";

import "./auth.scss";
import AuthService from "../../services/auth";
import authStore from "../../store/auth";
import { useNavigate } from "react-router-dom";

function AuthPage() {
	const passwordInputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();

	const [error, changeError] = useState<boolean>();

	return (
		<div className="auth_page">
			<div className="auth">
				<div className="title">Авторизация</div>
				<input
					className={"password " + (error ? "wrong" : "")}
					placeholder="Password:"
					ref={passwordInputRef}
				></input>
				<div
					className="login"
					onClick={async () => {
						if (passwordInputRef && passwordInputRef.current) {
							const authResult = await AuthService.auth(
								passwordInputRef.current.value
							);
							if (authResult) {
								authStore.token = authResult;
								authStore.authorized = true;
								navigate("/");
							} else {
								changeError(true);
								setTimeout(() => changeError(false), 750);
							}
						}
					}}
				>
					Войти
				</div>
			</div>
		</div>
	);
}

export default AuthPage;
