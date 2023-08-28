import { makeAutoObservable, runInAction } from "mobx";
import SectionsService from "../services/sections";
import { SectionType, isSection, isSections } from "../schemas/sections";
import { ImageType } from "../schemas/images";
import ImagesService from "../services/images";
import { FolderType, isFolder } from "../schemas/folders";
import { AboutType, isAbout } from "../schemas/about";
import AboutService from "../services/about";
import { TagType } from "../schemas/tags";
import TagsService from "../services/tags";
import authStore from "./auth";

type ContentType = AboutType | SectionType[];

class Store {
	constructor() {
		makeAutoObservable(this);
	}

	// ### Tags ###
	private _tags: TagType[] | undefined = undefined;
	get tags(): TagType[] | undefined {
		if (!this._tags) this.getTags();
		return this._tags;
	}
	set tags(d: TagType[] | undefined) {
		this._tags = d;
	}
	async getTags() {
		const tags = await TagsService.getTags();
		runInAction(() => {
			this.tags = tags;
		});
	}
	async changeTagName(tagId: number, newName: string) {
		if (authStore.token) {
			const r = await TagsService.changeTagName(
				tagId,
				newName,
				authStore.token
			);
			if (r) {
				if (this.tags) {
					this.tags = this.tags.map((t) => {
						if (t.tagId === tagId) t.tag = newName;
						return t;
					});
				}
				if (this.sections) {
					this.sections = this.sections.map((s) => {
						s.tags = s.tags.map((t) => {
							if (t.tagId === tagId) t.tag = newName;
							return t;
						});
						return s;
					});
				}
				if (this.viewedImages) {
					this.viewedImages = this.viewedImages.map((i) => {
						i.tags = i.tags.map((t) => {
							if (t.tagId === tagId) t.tag = newName;
							return t;
						});
						return i;
					});
				}
			}
		}
	}
	async addNewTag(tagName: string) {
		if (authStore.token) {
			const r = await TagsService.addNewTag(tagName, authStore.token);
			if (r) {
				const { tagId } = r;
				if (this.tags) {
					this.tags.push({ tagId, tag: tagName });
				}
			}
		}
	}
	async deleteTag(tagId: number) {
		if (authStore.token) {
			const r = await TagsService.deleteTag(tagId, authStore.token);
			if (r) {
				if (this.tags) {
					this.tags = this.tags.filter((t) => t.tagId !== tagId);
				}
				if (this.sections) {
					this.sections = this.sections.map((s) => {
						s.tags = s.tags.filter((t) => t.tagId !== tagId);
						return s;
					});
				}
				if (this.viewedImages) {
					this.viewedImages = this.viewedImages.map((i) => {
						i.tags = i.tags.filter((t) => t.tagId !== tagId);
						return i;
					});
				}
			}
		}
	}

	// ### Sections ###
	private _sections: SectionType[] | undefined = undefined;
	get sections(): SectionType[] | undefined {
		if (!this._sections) this.getMenu();
		return this._sections;
	}
	set sections(d: SectionType[] | undefined) {
		this._sections = d;
	}
	async changeSection(
		sectionId: number,
		newName: string,
		description: string,
		cover: number
	) {
		if (authStore.token) {
			const r = await SectionsService.changeSection(
				sectionId,
				newName,
				description,
				cover,
				authStore.token
			);
			if (r) {
				if (this.sections) {
					this.sections = this.sections.map((s) => {
						if (s.sectionId === sectionId) s = { ...r };
						return s;
					});
				}
				if (this.folders) {
					this.folders = this.folders.map((f) => {
						f.sections = f.sections.map((s) => {
							if (s.sectionId === sectionId) s = { ...r };
							return s;
						});
						return f;
					});
				}
				if (this.currentContent && Array.isArray(this.currentContent)) {
					this.currentContent = this.currentContent.map((c) => {
						if (c.sectionId === sectionId) c = { ...r };
						return c;
					});
				}
			}
		}
	}
	async toggleTagOnSection(section: SectionType, tag: TagType) {
		if (authStore.token) {
			const addOrDelete = !section.tags
				.map((t) => t.tagId)
				.includes(tag.tagId);
			const r = await SectionsService.toggleTagOnSection(
				section.sectionId,
				tag.tagId,
				addOrDelete,
				authStore.token
			);
			if (r) {
				this.sections = this.sections?.map((s) => {
					if (s.sectionId === section.sectionId) {
						addOrDelete
							? s.tags.push(tag)
							: (s.tags = s.tags.filter(
									(t) => t.tagId !== tag.tagId
							  ));
					}
					return s;
				});
				this.folders = this.folders?.map((f) => {
					f.sections = f.sections.map((s) => {
						if (s.sectionId === section.sectionId) {
							addOrDelete
								? s.tags.push(tag)
								: (s.tags = s.tags.filter(
										(t) => t.tagId !== tag.tagId
								  ));
						}
						return s;
					});
					return f;
				});
				this.viewedImages = undefined;
				if (isSection(this.currentContent))
					this.openSection(this.currentContent);
				else if (isFolder(this.currentContent))
					this.openFolder(this.currentContent);
				return true;
			} else return false;
		}
	}
	async addSection(sectionName: string) {
		if (authStore.token) {
			const r = await SectionsService.addSection(
				sectionName,
				authStore.token
			);
			if (r) {
				if (this.sections) {
					const { sectionId } = r;
					this.sections.push({
						section: sectionName,
						sectionId: sectionId,
						description: "0",
						cover: "0",
						coverId: 0,
						tags: [],
					});
				}
			}
		}
	}
	async deleteSection(sectionId: number) {
		if (authStore.token) {
			const r = await SectionsService.deleteSection(
				sectionId,
				authStore.token
			);
			if (r) {
				if (this.sections) {
					this.sections = this.sections.filter(
						(s) => s.sectionId !== sectionId
					);
					this.folders = this.folders?.map((f) => {
						f.sections = f.sections.filter(
							(s) => s.sectionId !== sectionId
						);
						return f;
					});
					if (this.currentContent) {
						if (!isAbout(this.currentContent)) {
							if (
								this.currentContent.length === 1 &&
								this.currentContent[0].sectionId === sectionId
							) {
								this.viewedImages = undefined;
								this.openSection(this.sections[0]);
							}
							if (Array.isArray(this.currentContent)) {
								this.currentContent =
									this.currentContent.filter(
										(s) => s.sectionId !== sectionId
									);
							}
						}
					}
				}
			}
		}
	}

	// ### Folders ###
	private _folders: FolderType[] | undefined = undefined;
	get folders(): FolderType[] | undefined {
		if (!this._folders) this.getMenu();
		return this._folders;
	}
	set folders(d: FolderType[] | undefined) {
		this._folders = d;
	}
	async changeFolderName(folderId: number, newName: string) {
		if (authStore.token) {
			const r = await SectionsService.changeFolderName(
				folderId,
				newName,
				authStore.token
			);
			if (r) {
				if (this.folders) {
					this.folders = this.folders.map((f) => {
						if (f.folderId === folderId) f.folder = newName;
						return f;
					});
				}
			}
		}
	}
	async toggleSectionOnFolder(folder: FolderType, section: SectionType) {
		if (authStore.token) {
			const addOrDelete = !folder.sections
				.map((s) => s.sectionId)
				.includes(section.sectionId);
			const r = await SectionsService.toggleSectionOnFolder(
				folder.folderId,
				section.sectionId,
				addOrDelete,
				authStore.token
			);
			if (r) {
				this.sections = addOrDelete
					? this.sections?.filter(
							(s) => s.sectionId !== section.sectionId
					  )
					: this.sections?.concat([section]);
				this.folders = this.folders?.map((f) => {
					if (f.folderId === folder.folderId) {
						addOrDelete
							? f.sections.push(section)
							: (f.sections = f.sections.filter(
									(s) => s.sectionId !== section.sectionId
							  ));
					}
					return f;
				});
				this.viewedImages = undefined;
				if (isSection(this.currentContent))
					this.openSection(this.currentContent);
				else if (isFolder(this.currentContent))
					this.openFolder(this.currentContent);
				return true;
			} else return false;
		}
	}
	async addFolder(folderName: string) {
		if (authStore.token) {
			const r = await SectionsService.addFolder(
				folderName,
				authStore.token
			);
			if (r) {
				if (this.folders) {
					const { folderId } = r;
					this.folders.push({
						folder: folderName,
						folderId: folderId,
						sections: [],
					});
				}
			}
		}
	}
	async deleteFolder(folderId: number) {
		if (authStore.token) {
			const r = await SectionsService.deleteFolder(
				folderId,
				authStore.token
			);
			if (r) {
				if (this.folders && this.sections) {
					const folder = this.folders.find(
						(f) => f.folderId === folderId
					);
					if (folder) {
						this.folders = this.folders.filter(
							(f) => f.folderId !== folderId
						);
						this.sections = [
							...this.sections,
							...folder.sections,
						].sort((a, b) => (a.sectionId > b.sectionId ? 1 : -1));
						if (
							Array.isArray(this.currentContent) &&
							this.currentContent.every((c) =>
								folder.sections
									.map((s) => s.sectionId)
									.includes(c.sectionId)
							)
						) {
							this.currentContent = [this.sections[0]];
							this.viewedImages = undefined;
						}
					}
				}
			}
		}
	}

	async getMenu() {
		const { sections, folders } = await SectionsService.getMenu();
		runInAction(() => {
			this.sections = sections;
			this.folders = folders;
		});
	}

	// ### Current content ###
	private _currentContent: ContentType | undefined = undefined;
	get currentContent(): ContentType | undefined {
		if (this.sections && !this._currentContent) {
			this._currentContent = [this.sections[0]];
		}
		return this._currentContent;
	}
	set currentContent(d: ContentType | undefined) {
		this._currentContent = d;
	}
	openSection(section: SectionType) {
		this.currentContent = [section];
	}
	openFolder(folder: FolderType) {
		this.currentContent = folder.sections;
	}
	openAbout() {
		if (!this.about) this.getAbout(true);
		this.currentContent = this.about;
	}
	openOverview() {
		if (!this.allImages) this.getAllImages(true);
		this.viewedImages = undefined;
		this.viewedImages = this.allImages;
		this.currentContent = [
			{
				section: "Overview",
				sectionId: 0,
				description: "0",
				cover: "",
				coverId: 0,
				tags: [],
			},
		];
	}

	// ### Images ###
	private _images: ImageType[] | undefined = undefined;
	get images(): ImageType[] | undefined {
		if (!this._images) this.getImages();
		return this._images;
	}
	set images(d: ImageType[] | undefined) {
		this._images = d;
	}
	async getImages() {
		const images = await ImagesService.getImages();
		runInAction(() => (this.images = images));
	}

	private _viewedImages: ImageType[] | undefined = undefined;
	get viewedImages(): ImageType[] | undefined {
		if (
			this.currentContent &&
			(isSection(this.currentContent) ||
				(Array.isArray(this.currentContent) &&
					isSections(this.currentContent))) &&
			!this._viewedImages
		) {
			Promise.all(
				(Array.isArray(this.currentContent)
					? this.currentContent
					: [this.currentContent]
				).map(
					async (section) => await this.requestSectionImages(section)
				)
			).then((groupsOfImages) => {
				const newViewedImages: ImageType[] = [];
				groupsOfImages.forEach((sectionImages) =>
					sectionImages.forEach((image) =>
						newViewedImages.push(image)
					)
				);
				this.viewedImages = newViewedImages;
			});
		}

		return this._viewedImages;
	}
	set viewedImages(d: ImageType[] | undefined) {
		this._viewedImages = d;
	}
	async requestSectionImages(section: SectionType) {
		return await ImagesService.getSectionImages(section);
	}
	async getSectionImages(section: SectionType) {
		const viewedImages = await this.requestSectionImages(section);
		runInAction(() => (this.viewedImages = viewedImages));
	}
	async toggleTagOnImage(image: ImageType, tag: TagType) {
		if (authStore.token) {
			const addOrDelete = !image.tags
				.map((t) => t.tagId)
				.includes(tag.tagId);
			const r = await ImagesService.toggleTagOnImage(
				image.imageId,
				tag.tagId,
				addOrDelete,
				authStore.token
			);
			if (r) {
				this.viewedImages = this.viewedImages?.map((i) => {
					if (i.imageId === image.imageId) {
						if (addOrDelete) i.tags.push(tag);
						else
							i.tags = i.tags.filter(
								(t) => t.tagId !== tag.tagId
							);
					}
					return i;
				});
				return true;
			} else return false;
		}
	}
	async changeImagePriority(imageId: number, priority: number) {
		if (authStore.token) {
			const r = await ImagesService.changeImagePriority(
				imageId,
				priority,
				authStore.token
			);
			if (r) {
				if (this.viewedImages) {
					this.viewedImages = this.viewedImages.map((i) => {
						if (i.imageId === imageId) i.priority = priority;
						return i;
					});
				}
				return true;
			}
		}
		return false;
	}
	async addImage(image: File) {
		if (authStore.token) {
			const r = await ImagesService.addImage(image);
			if (r) {
				if (
					this.currentContent &&
					Array.isArray(this.currentContent) &&
					this.currentContent[0].section === "Overview"
				) {
					this.viewedImages = [
						{
							imageId: r.imageId,
							image: r.image,
							tags: [],
							priority: 50,
						},
						...(this.viewedImages ?? []),
					];
				}
			}
		}
	}
	async deleteImage(imageId: number) {
		if (authStore.token) {
			const r = await ImagesService.deleteImage(imageId, authStore.token);
			if (r) {
				if (
					store.currentContent &&
					Array.isArray(store.currentContent) &&
					store.currentContent[0].section === "Overview"
				) {
					store.viewedImages = store.viewedImages?.filter(
						(i) => i.imageId !== imageId
					);
				}
			}
		}
	}

	// ### About ###
	private _about: AboutType | undefined = undefined;
	get about(): AboutType | undefined {
		if (!this._about) this.getAbout();
		return this._about;
	}
	set about(d: AboutType | undefined) {
		this._about = d;
	}
	async getAbout(open = false) {
		const about = await AboutService.getAboutContent();
		runInAction(() => (this.about = about));
		if (open) this.openAbout();
	}

	// ### Overview ###
	private _allImages: ImageType[] | undefined = undefined;
	get allImages(): ImageType[] | undefined {
		if (!this._allImages) this.getAllImages();
		return this._allImages;
	}
	set allImages(d: ImageType[] | undefined) {
		this._allImages = d;
	}
	async getAllImages(open = false) {
		const allImages = await ImagesService.getImages();
		runInAction(() => (this.allImages = allImages));
		if (open) this.openOverview();
	}
}
const store = new Store();
export default store;
