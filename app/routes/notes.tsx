// IMPORTING NECESSARY FILES
    // IMPORTING COMPONENTS
import Form from "~/components/Form"
    // IMPORTING TYPES
import { ActionFunction, json } from "@remix-run/node"
import { FormStatusType, ServerResponse } from "~/types/types"
    // IMPORTING LIB FUNCTIONS
import { addNote as addNoteServer } from "~/lib/serverHelpers"
    // IMPORTING MODULES
import React from "react"
import { useActionData } from "@remix-run/react"

// A SERVER ACTION FOR THE POST REQUEST
export const action: ActionFunction = async({request}) => {
    try{
        if(request.method === "POST"){
            return addNoteServer(request)
        }else{
            return json({error: "Wrong HTTP method for this server route"}, {status: 503})
        }
    }catch(error: unknown){
        console.error((error as Error).message)
        return json({error: (error as Error).message}, {status: 500})
    }
}

// A FUNCTION THAT RETURNS THE NOTESPAGE
export default function NotesPage(){
	// FETCHING LATEST ACTION CALL
    const APIResponse: ServerResponse = useActionData()!

	// A STATE TO KEEP TRACK OF THE FORM
	const [formStatus, setFormStatus] = React.useState<FormStatusType>({
		error: "",
		success: "",
	})

    // A USE EFFECT TO SYNC THE API RESULTS WITH THE FORM STATUS
    React.useEffect(() => {
        if(APIResponse) setFormStatus({
            error: APIResponse.error || "",
            success: APIResponse.success || ""
        })
    }, [APIResponse])

	return (
		<main>
			<Form />
			<p>{formStatus.success ?? formStatus.error}</p>
		</main>
	)
}