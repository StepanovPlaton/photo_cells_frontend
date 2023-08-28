import { AboutType, aboutSchema } from "../schemas/about";
import RESTService from "./rest";

import cookie from "react-cookies";

export default class AuthService {
	//public static async getAboutContent(): Promise<AboutType> {
	//	return aboutSchema.parse(await RESTService.get(`api/about`));
	//}

	public static setToken(token: string) {
		cookie.save("token", token, {});
	}

	private static getTokenFromCookie(): string | undefined {
		return cookie.load("token");
	}

	public static async getActualToken(): Promise<string | undefined> {
		const cookieToken = this.getTokenFromCookie();
		if (!cookieToken) return undefined;
		if (
			(await RESTService.post(`api/admin/token`, {
				token: cookieToken,
			})) === null
		) {
			return cookieToken;
		} else return undefined;
	}

	public static async auth(password: string): Promise<string | null> {
		const response = await RESTService.post(`api/admin/auth`, {
			password: password,
		});
		if (response && response.token) return response.token;
		else return null;
	}
}
