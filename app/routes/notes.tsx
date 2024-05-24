// IMPORTING NECESSARY FILES
    // IMPORTING COMPONENTS
import Form from "~/components/Form"
    // IMPORTING TYPES
import { ActionFunction, json, redirect} from "@remix-run/node"
import { NoteType, NoteErrorType, FormDataType } from "~/types/types"
    // IMPORTING LIB FUNCTIONS
import database, {addData} from "~/lib/databaseHelpers"

// A SERVER ACTION FOR THE POST REQUEST
export const action: ActionFunction = async({request}) => {
    try{
        const formBody = await request.formData()
        const body = Object.fromEntries(formBody) as FormDataType
        const errors: NoteErrorType = {}
        
        if(!body.title){
            errors.title = "The note lacks a title"
        }

        if(body.content && body.content.split('').length < 5){
            errors.content = "The content of the note is too short"
        }

        if(Object.keys(errors).length > 0){
            return json({errors})
        }else{
            const {message} = await addData<NoteType>(database.notes, "notes", {date: new Date(), ...body})
            console.log(message)
            return redirect("/notes")
        }
    }catch(error: unknown){
        console.error((error as Error).message)
        return json({error: (error as Error).message}, {status: 500})
    }
}

// A FUNCTION THAT RETURNS THE NOTESPAGE
export default function NotesPage(){
    return(
        <main>
            <Form/>
        </main>
    )
}