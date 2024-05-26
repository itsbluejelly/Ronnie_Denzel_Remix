// IMPORTING NECESSARY FILES
    // IMPORTING TYPES
import { NoteType } from "./types";
    // IMPORTING GENERICS
import {Prettier} from "./generics"

// PROPS FOR THE FORM COMPONENT
export type FormProps = {
    disabled: boolean,
    handleClick(): void
}

// PROPS FOR THE NOTE COMPONENT
export type NoteProps = Prettier<NoteType & { index: number }>