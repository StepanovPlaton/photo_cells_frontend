import { z } from "zod";
import { sectionsSchema } from "./sections";

export const folderSchema = z.object({
	folderId: z.number(),
	folder: z.string(),
	sections: sectionsSchema,
});
export const foldersSchema = z.array(folderSchema);

export type FolderType = z.infer<typeof folderSchema>;

export function isFolder(nlo: any): nlo is FolderType {
	return folderSchema.safeParse(nlo).success;
}

export const folderCreateResponseSchema = z.object({
	folderId: z.number(),
});

export type FolderCreateResponseType = z.infer<
	typeof folderCreateResponseSchema
>;
