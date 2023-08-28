import { z } from "zod";

export const aboutSchema = z.object({
	aboutMe: z.string(),
	avatar: z.string(),
});

export type AboutType = z.infer<typeof aboutSchema>;

export function isAbout(nlo: any): nlo is AboutType {
	return aboutSchema.safeParse(nlo).success;
}
