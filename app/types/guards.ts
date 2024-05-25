// IMPORTING NECESSARY TYPES
import { NoteType } from "./types";

// A GUARD FOR THE NOTE DATA
export function isNotes(data: unknown): data is NoteType[]{
    if(Array.isArray(data)){
        return data.every(note => (
            typeof note === "object" && "ID" in note &&
            typeof note.ID === "string" && "title" in note &&
            typeof note.title === "string" && "date" in note &&
            typeof note.date === typeof Date
        ))
    }else{
        return false
    }
}