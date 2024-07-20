// IMPORTING NECESSARY FILES
import { z } from "zod"

// Declaring the envSchema and envSchemaType to extend the process.env values
export const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	VITE_TEST_MODE: z.enum(["TRUE", "FALSE"])
})

export type envSchemaType = z.infer<typeof envSchema>