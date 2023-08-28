import { TagType, tagCreateResponseSchema, tagsSchema } from "../schemas/tags";
import RESTService from "./rest";

export default abstract class TagsService {
	public static async getTags(): Promise<TagType[]> {
		return tagsSchema.parse(await RESTService.get(`api/tags`));
	}

	public static async changeTagName(
		tagId: number,
		newName: string,
		token: string
	) {
		try {
			await RESTService.put(`api/tags/${tagId}?edited_name=${newName}`, {
				token,
			});
			return true;
		} catch (e) {
			return false;
		}
	}

	public static async addNewTag(tagName: string, token: string) {
		try {
			return tagCreateResponseSchema.parse(
				await RESTService.post(`api/tags?tag_name=${tagName}`, {
					token,
				})
			);
		} catch (e) {
			return false;
		}
	}

	public static async deleteTag(tagId: number, token: string) {
		try {
			await RESTService.delete(`api/tags/${tagId}`, {
				token,
			});
			return true;
		} catch (e) {
			return false;
		}
	}
}
