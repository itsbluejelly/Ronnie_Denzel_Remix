// IMPORTING NECESSARY FILES
    // IMPORTING GENERICS
import { ObjectGenerator, OptionalGenerator, Excluder } from "./generics"

// A TYPE FOR THE DATABASE
export type DatabaseType = ObjectGenerator<"notes", string>
// A TYPEFOR THE NOTE ERROR
export type NoteErrorType = OptionalGenerator<Excluder<NoteType, "date">>
// A TYPE FOR THE FORMDATA
export type FormDataType = Excluder<NoteType, "date">

// A TYPE FOR THE NOTES
export type NoteType = {
    title: string,
    content?: string,
    date: Date 
}