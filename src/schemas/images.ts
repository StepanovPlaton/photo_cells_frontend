import { z } from "zod";
import { tagsSchema } from "./tags";

export const imageSchema = z.object({
	imageId: z.number(),
	image: z.string(),
	tags: tagsSchema,
	priority: z.number(),
});
export const imagesSchema = z.array(imageSchema);

export type ImageType = z.infer<typeof imageSchema>;

export const imageCreateResponseSchema = z.object({
	imageId: z.number(),
	image: z.string(),
});

export type ImageCreateResponseType = z.infer<typeof imageCreateResponseSchema>;
