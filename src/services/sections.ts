import {
	FolderType,
	folderCreateResponseSchema,
	foldersSchema,
} from "../schemas/folders";
import {
	SectionType,
	sectionCreateResponseSchema,
	sectionSchema,
	sectionsSchema,
} from "../schemas/sections";
import RESTService from "./rest";

export default abstract class SectionsService {
	public static async getSections(): Promise<SectionType[]> {
		return sectionsSchema.parse(await RESTService.get(`api/sections`));
	}

	public static async getFolders(): Promise<FolderType[]> {
		return foldersSchema.parse(await RESTService.get(`api/folders`));
	}

	public static async getMenu(): Promise<{
		sections: SectionType[];
		folders: FolderType[];
	}> {
		return Promise.all([
			await this.getSections(),
			await this.getFolders(),
		]).then(([sections, folders]) => {
			const sectionsIdInFolders: number[] = [];
			folders.forEach((folder) =>
				folder.sections.forEach((section) => {
					if (!sectionsIdInFolders.includes(section.sectionId)) {
						sectionsIdInFolders.push(section.sectionId);
					}
				})
			);
			return {
				sections: sections.filter(
					(section) =>
						!sectionsIdInFolders.includes(section.sectionId)
				),
				folders,
			};
		});
	}

	public static async addSection(sectionName: string, token: string) {
		try {
			return sectionCreateResponseSchema.parse(
				await RESTService.post(
					`api/sections?section=${sectionName}&description=0&cover=0`,
					{
						token,
					}
				)
			);
		} catch (e) {
			return false;
		}
	}
	public static async deleteSection(sectionId: number, token: string) {
		try {
			await RESTService.delete(`api/sections/${sectionId}`, {
				token,
			});
			return true;
		} catch (e) {
			return false;
		}
	}
	public static async changeSection(
		sectionId: number,
		newName: string,
		description: string,
		cover: number,
		token: string
	) {
		try {
			return sectionSchema.parse(
				await RESTService.put(
					`api/sections/${sectionId}?edited_name=${newName}&description=${description}&cover=${cover}`,
					{
						token,
					}
				)
			);
		} catch (e) {
			return false;
		}
	}

	public static async addFolder(folderName: string, token: string) {
		try {
			return folderCreateResponseSchema.parse(
				await RESTService.post(`api/folders?folder=${folderName}`, {
					token,
				})
			);
		} catch (e) {
			return false;
		}
	}
	public static async deleteFolder(folderId: number, token: string) {
		try {
			await RESTService.delete(`api/folders/${folderId}`, {
				token,
			});
			return true;
		} catch (e) {
			return false;
		}
	}
	public static async changeFolderName(
		folderId: number,
		newName: string,
		token: string
	) {
		try {
			await RESTService.put(
				`api/folders/${folderId}?edited_name=${newName}`,
				{
					token,
				}
			);
			return true;
		} catch (e) {
			return false;
		}
	}

	public static async toggleTagOnSection(
		sectionId: number,
		tagId: number,
		addOrDelete: boolean,
		token: string
	) {
		try {
			await (addOrDelete ? RESTService.post : RESTService.delete)(
				`api/sections/${sectionId}/tags/${tagId}`,
				{ token }
			);
			return true;
		} catch (e) {
			return false;
		}
	}

	public static async toggleSectionOnFolder(
		folderId: number,
		sectionId: number,
		addOrDelete: boolean,
		token: string
	) {
		try {
			await (addOrDelete ? RESTService.post : RESTService.delete)(
				`api/folders/${folderId}/sections/${sectionId}`,
				{ token }
			);
			return true;
		} catch (e) {
			return false;
		}
	}
}
