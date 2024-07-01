import { z } from "zod"
import { isMongoId } from "validator"

// Declaring the note schema
export const noteSchema = z.object({
	title: z
		.string({ message: "The title must be a string" })
		.trim()
		.min(1, "The title must have a minimum of 1 character"),

	content: z
		.string({ message: "The content must be a string" })
		.trim()
		.min(5, "The content must have a minimum of 5 characters")
		.optional(),
})

// Declaring the note ID schema
export const noteIDSchema = z.object({
	_id: z
		.string({ message: "The _id property must be a string" })
		.refine((val) => isMongoId(val), {
			message: "The _id param must be a valid ID",
            path: ["_id"]
		}),
})
