// IMPORTING NECESSARY FILES
    // IMPORTING LIB
import database, { addData } from "./databaseHelpers";
    // IMPORTING TYPES
import { NoteType, FormDataType, DatabaseResponse } from "~/types/types";
import { RequestHandler, json } from "@remix-run/node";
    // IMPORTING GENERICS
import { Excluder } from "~/types/generics";

// A FUNCTION TO HELP ADD NOTES VIA THE SERVER
export const addNote: RequestHandler = async(request) => {
    try{
        // OBTAINING THE BODY OF THE REQUEST AND SANITIZING IT
        const formData: FormDataType = await request.json()

        if (!formData.title) {
            return json({error: "The note lacks a title"}, {status: 400})
        }else if(formData.content && formData.content.split("").length < 5){
            return json({error: "The content of the note is too short"}, {status: 400})
        }

        // IF DATA IS OKAY, ADD IT TO THE DATABASE
        const {error, data}: DatabaseResponse = await addData<Excluder<NoteType, "ID">>(
			database.notes,
			"notes",
			{ ...formData, date: new Date() }
		)

        if(error){
            throw new Error(error)
        }else{
            return json({data, success: "Data fetched successfully"}, {status: 201})
        }

    }catch(error: unknown){
        console.error((error as Error).message)
        return json({ error: (error as Error).message }, {status: 500})
    }
}