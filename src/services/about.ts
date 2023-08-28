import { AboutType, aboutSchema } from "../schemas/about";
import RESTService from "./rest";

export default class AboutService {
	public static async getAboutContent(): Promise<AboutType> {
		return aboutSchema.parse(await RESTService.get(`api/about`));
	}
}
