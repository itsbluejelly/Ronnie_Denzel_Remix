// IMPORTING NECESSARY FILES
    // IMPORTING TYPES
import { NoteType, FormDataType } from "./types";
    // IMPORTING GENERICS
import {Prettier, Excluder} from "./generics"

// PROPS FOR THE FORM COMPONENT
export type FormProps = {
    disabled: boolean,
    handleClick(): void,
    handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void,
    formMode: "add" | "edit",
    formData: FormDataType & {ID: string}
}

// PROPS FOR THE NOTE COMPONENT
export type NoteProps = Prettier<Excluder<NoteType, "ID"> & { 
    index: number,
    handleEdit(): void,
    handleDelete(): void 
}>