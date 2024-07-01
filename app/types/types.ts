// IMPORTING NECESSARY FILES
    // IMPORTING GENERICS
import { ObjectGenerator, OptionalGenerator, Prettier } from "./generics"

// A TYPE FOR THE DATABASE
export type DatabaseType = ObjectGenerator<"notes", string>

// A TYPE FOR THE SERVER RESPONSE
export type ServerResponse = OptionalGenerator<{
    error: string
    data: unknown
    success: string
}>

// A TYPE FOR THE DATABASE RESPONSE
export type DatabaseResponse = OptionalGenerator<{
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