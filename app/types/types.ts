/*
    THIS FILE CONTAINS ALL SELF-DEFINED TYPES FOR THE APPLICATION, PLEASE NOTE THAT WE ONLY CORRELATE TYPES WITH GENERICS FROM DATABASE TYPES, LIKE THE NOTEDATA TYPE CAN GENERATE:
        1. A FORMDATA FOR THAT TYPE
        2. A PROPS FOR THE RELATED COMPONENT
    TO AVOID OVER-DEPENDENCY
*/

// IMPORTING NECESSARY FILES
    // IMPORTING GENERICS
import { ObjectGenerator, OptionalGenerator, Excluder, Prettier } from "./generics"

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
export type FormStatusType = Prettier<
	ObjectGenerator<"success" | "error", string> & { isOpen: boolean }
>