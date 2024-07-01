// IMPORTING NECESSARY FILES
    // IMPORTING GENERICS
import { ObjectGenerator, OptionalGenerator, Prettier } from "./generics"

// A TYPE FOR THE ACTION RESPONSE
export type ActionResponse = OptionalGenerator<{
    error: string
    data: unknown
    success: string
}>

// A TYPE FOR THE LOADER RESPONSE
export type LoaderResponse = OptionalGenerator<{
	error: string
	data: unknown
}>

// A TYPE FOR THE FORM STATUS
export type FormStatusType = Prettier<
	ObjectGenerator<"success" | "error", string> & { 
        isOpen: boolean
        formMode: "edit" | "add" 
    }
>