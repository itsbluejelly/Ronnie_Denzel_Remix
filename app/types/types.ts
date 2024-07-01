// IMPORTING NECESSARY FILES
// IMPORTING GENERICS
import { ObjectGenerator, Prettier } from "./generics"
import { z } from "zod"
import { noteIDSchema, noteSchema } from "utils/schemas"

// A TYPE FOR THE ACTION RESPONSE
export type ActionResponse =
	| { error: z.inferFlattenedErrors<typeof noteIDSchema | typeof noteSchema> }
	| { success: string }

// A TYPE FOR THE LOADER RESPONSE
export type LoaderResponse = {
    success: string
    data: unknown
}
	| 

{
    error: string
    data: unknown
}

// A TYPE FOR THE FORM STATUS
export type FormStatusType = Prettier<
	ObjectGenerator<"success" | "error", string> & {
		isOpen: boolean
		formMode: "edit" | "add"
	}
>
