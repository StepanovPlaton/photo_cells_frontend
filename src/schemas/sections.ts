import { z } from "zod";
import { tagsSchema } from "./tags";

export const sectionSchema = z.object({
	sectionId: z.number(),
	section: z.string(),
	description: z.string(),
	cover: z.string().nullable(),
	coverId: z.number(),
	tags: tagsSchema,
});
export const sectionsSchema = z.array(sectionSchema);

export type SectionType = z.infer<typeof sectionSchema>;

export type SectionWithInfoType = SectionType & {
	selected: boolean;
};

export function isSection(nlo: any): nlo is SectionType {
	return sectionSchema.safeParse(nlo).success;
}
export function isSections(nlo: any[]): nlo is SectionType[] {
	return sectionsSchema.safeParse(nlo).success;
}

export const sectionCreateResponseSchema = z.object({
	sectionId: z.number(),
});

export type SectionCreateResponseType = z.infer<
	typeof sectionCreateResponseSchema
>;
