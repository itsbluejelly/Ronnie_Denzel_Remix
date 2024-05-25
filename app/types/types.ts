// IMPORTING NECESSARY FILES
    // IMPORTING GENERICS
import { ObjectGenerator, OptionalGenerator, Excluder } from "./generics"

// A TYPE FOR THE DATABASE
export type DatabaseType = ObjectGenerator<"notes", string>
// A TYPE FOR THE FORMDATA
export type FormDataType = Excluder<NoteType, "date" | "ID">

// A TYPE FOR THE NOTES
export type NoteType = {
    title: string,
    content?: string,
    date: Date ,
    ID: string
}

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
export type FormStatusType = ObjectGenerator<"success" | "error", string>