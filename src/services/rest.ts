export default abstract class RESTService {
	public static async get(url: string): Promise<any> {
		try {
			const response = await fetch(url, {
				method: "GET",
				headers: {
					accept: "application/json",
				},
			});
			if (response.ok) {
				return await response.json();
			}
		} catch {}
	}

	public static async post(url: string, body?: object): Promise<any> {
		return await fetch(url, {
			method: "POST",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json;charset=utf-8",
			},
			body: JSON.stringify(body),
		})
			.then((r) => {
				if (r && r.ok) return r;
				else throw Error();
			})
			.then((r) => {
				return r.json();
			})
			.catch((e) => {
				return null;
			});
	}

	public static async delete(url: string, body?: object): Promise<any> {
		return await fetch(url, {
			method: "DELETE",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json;charset=utf-8",
			},
			body: JSON.stringify(body),
		})
			.then((r) => {
				if (r && r.ok) return r;
				else return null;
			})
			.then((r) => {
				return r ? r.json() : null;
			});
	}

	public static async put(url: string, body?: object): Promise<any> {
		return await fetch(url, {
			method: "PUT",
			headers: {
				accept: "application/json",
				"Content-Type": "application/json;charset=utf-8",
			},
			body: JSON.stringify(body),
		})
			.then((r) => {
				if (r && r.ok) return r;
				else return null;
			})
			.then((r) => {
				return r ? r.json() : null;
			});
	}
}
