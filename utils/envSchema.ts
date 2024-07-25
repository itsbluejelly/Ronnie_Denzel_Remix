// IMPORTING NECESSARY FILES
import { z } from "zod"

// Declaring the envSchema and parsing the process.env to see if its okay
export const envSchema = z.object({
	DATABASE_URL_PROD: z
		.string({ message: "The DATABASE_URL_PROD must be a valid string" })
		.url({ message: "The DATABASE_URL_PROD must be a valid URL" }),

	DATABASE_URL_DEV: z.string({
		message: "The DATABASE_URL_PROD must be a valid string",
	}),

	VITE_TEST_MODE: z.enum(["TRUE", "FALSE"], {
		message: "The VITE_TEST_MODE must be either 'TRUE' or 'FALSE'",
	}),

	NODE_ENV: z
		.enum(["development", "production", "test"], {
			message:
				"The NODE_ENV must be either 'test' or 'production' or 'development'",
		})
		.default("development"),
})

const parsedEnv = envSchema.parse(process.env)
export default parsedEnv
