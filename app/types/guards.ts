// IMPORTING NECESSARY TYPES
import { type Note as NoteType } from "@prisma/@prisma-mongodb";

// A GUARD FOR THE NOTE DATA
export function isNotes(data: unknown): data is NoteType[]{
    if(Array.isArray(data)){
        return data.every(note => (
            typeof note === "object" && "id" in note &&
            typeof note.id === "string" && "title" in note &&
            typeof note.title === "string" && "createdAt" in note &&
            typeof note.createdAt === "string"
        ))
    }else{
        return false
    }
}