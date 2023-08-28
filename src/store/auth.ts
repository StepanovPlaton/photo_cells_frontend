import { makeAutoObservable, runInAction } from "mobx";
import AuthService from "../services/auth";

class AuthStore {
	constructor() {
		makeAutoObservable(this);
	}

	private _authorized: boolean = false;
	get authorized() {
		if (!this._authorized) this.getToken();
		return this._authorized;
	}
	set authorized(d: boolean) {
		this._authorized = d;
	}
	private _token: string | undefined = undefined;
	get token(): string | undefined {
		if (!this._token) this.getToken();
		return this._token;
	}
	set token(d: string | undefined) {
		if (d && this._token !== d) this.saveToken(d);
		this._token = d;
	}
	private async getToken() {
		const token = await AuthService.getActualToken();
		if (!token) {
			//window.location.href = "/auth";
			this.authorized = false;
		} else {
			runInAction(() => {
				this.authorized = true;
				this.token = token;
			});
		}
	}
	private saveToken(token: string) {
		AuthService.setToken(token);
	}
}
const authStore = new AuthStore();
export default authStore;
