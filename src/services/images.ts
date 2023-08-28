import {
	ImageType,
	imageCreateResponseSchema,
	imageSchema,
	imagesSchema,
} from "../schemas/images";
import { SectionType } from "../schemas/sections";
import RESTService from "./rest";

export default class ImagesService {
	public static async getImages(): Promise<ImageType[]> {
		return imagesSchema.parse(await RESTService.get(`api/images`));
	}

	public static async getImage(imageId: number): Promise<ImageType> {
		return imageSchema.parse(
			await RESTService.get(`api/images/${imageId}`)
		);
	}

	public static async getSectionImages(
		section: SectionType
	): Promise<ImageType[]> {
		return imagesSchema.parse(
			await RESTService.get(`api/sections/${section.sectionId}`)
		);
	}

	public static async toggleTagOnImage(
		imageId: number,
		tagId: number,
		addOrDelete: boolean,
		token: string
	) {
		try {
			await (addOrDelete ? RESTService.post : RESTService.delete)(
				`api/images/${imageId}/tags/${tagId}`,
				{ token }
			);
			return true;
		} catch (e) {
			return false;
		}
	}

	public static async addImage(image: File) {
		try {
			let data = new FormData();
			data.append("upload_image", image);
			return imageCreateResponseSchema.parse(
				await fetch(`api/images`, {
					method: "POST",
					headers: {},
					body: data,
				})
					.then((r) => {
						if (r && r.ok) return r;
						else throw Error();
					})
					.then((r) => {
						return r.json();
					})
			);
		} catch (e) {
			console.log(e);
			return false;
		}
	}
	public static async deleteImage(imageId: number, token: string) {
		try {
			await RESTService.delete(`api/images/${imageId}`, {
				token,
			});
			return true;
		} catch (e) {
			return false;
		}
	}
	public static async changeImagePriority(
		imageId: number,
		priority: number,
		token: string
	) {
		try {
			await RESTService.put(
				`api/images/${imageId}?priority=${priority}`,
				{
					token,
				}
			);
			return true;
		} catch (e) {
			return false;
		}
	}
}
