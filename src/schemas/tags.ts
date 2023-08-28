import { z } from "zod";

export const tagSchema = z.object({
	tagId: z.number(),
	tag: z.string(),
});
export const tagsSchema = z.array(tagSchema);

export type TagType = z.infer<typeof tagSchema>;

export type TagWithInfoType = TagType & {
	selected: boolean;
};

export const tagCreateResponseSchema = z.object({
	tagId: z.number(),
});

export type TagCreateResponseType = z.infer<typeof tagCreateResponseSchema>;
