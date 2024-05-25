// IMPORTING NECESSARY FILES
    // IMPORTING LIB
import database, { addData, deleteData, editData, getData } from "./databaseHelpers";
    // IMPORTING TYPES
import { NoteType, FormDataType, DatabaseResponse } from "~/types/types";
import { RequestHandler, json } from "@remix-run/node";
    // IMPORTING GENERICS
import { Excluder } from "~/types/generics";

// A FUNCTION TO GET NOTES VIA THE SERVER
export const getNotes: RequestHandler = async () => {
	try {
		// RETURN DATA FROM DATABASE
		const {error, data}: DatabaseResponse = await getData<NoteType>(database.notes, "notes")

		if (error) {
			throw new Error(error)
		} else {
			console.log(`Data returned:\n${JSON.stringify(data)}\n`)
			
            return json(
				{ data, success: "Data fetched successfully" },
				{ status: 200 }
			)
		}
	} catch (error: unknown) {
		console.error((error as Error).message)
		return json({ error: (error as Error).message }, { status: 500 })
	}
}

// A FUNCTION TO HELP ADD NOTES VIA THE SERVER
export const addNote: RequestHandler = async(request) => {
    try{
        // OBTAINING THE BODY OF THE REQUEST AND SANITIZING IT
        const response: FormData = await request.formData()
        const formData = Object.fromEntries(response) as FormDataType

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
            console.log(`Data returned:\n${JSON.stringify(data)}\n`)
            return json({data, success: "Data added successfully"}, {status: 201})
        }

    }catch(error: unknown){
        console.error((error as Error).message)
        return json({ error: (error as Error).message }, {status: 500})
    }
}

// A FUNCTION TO HELP EDIT NOTES VIA THE SERVER
export const editNote: RequestHandler = async(request) => {
    try{
		// OBTAINING THE BODY OF THE REQUEST AND SANITIZING IT
		const response: FormData = await request.formData()
		const formData = Object.fromEntries(response) as Excluder<NoteType, "date">

		if (!formData.title) {
			return json({ error: "The note lacks a title" }, { status: 400 })
		} else if (formData.content && formData.content.split("").length < 5) {
			return json(
				{ error: "The content of the note is too short" },
				{ status: 400 }
			)
		}

		// IF DATA IS OKAY, EDIT IT IN THE DATABASE
		const { error, data }: DatabaseResponse = await editData<
			Excluder<NoteType, "date">
		>(database.notes, "notes", formData)

		if (error) {
			throw new Error(error)
		} else {
			console.log(`Data returned:\n${JSON.stringify(data)}\n`)
			return json(
				{ data, success: "Data edited successfully" },
				{ status: 200 }
			)
		}
	}catch(error: unknown){
        console.error((error as Error).message)
        return json({ error: (error as Error).message }, {status: 500})
    }
}

// A FUNCTION TO HELP DELETE NOTES VIA THE SERVER
export const deleteNote: RequestHandler = async(request) => {
    try{
        // OBTAINING THE BODY OF THE REQUEST
        const response: FormData = await request.formData()
		const formData = Object.fromEntries(response) as {ID: string}

        // IF DATA IS OKAY, DELETE IT FROM THE DATABASE
        const { error, data }: DatabaseResponse = await deleteData<{
			ID: string
		}>(database.notes, "notes", formData)

        if(error){
            throw new Error(error)
        }else{
            console.log(`Data returned:\n${JSON.stringify(data)}\n`)
            return json({data, success: "Data deleted successfully"}, {status: 200})
        }

    }catch(error: unknown){
        console.error((error as Error).message)
        return json({ error: (error as Error).message }, {status: 500})
    }
}