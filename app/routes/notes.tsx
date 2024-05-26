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
import { useActionData, useNavigation } from "@remix-run/react"

// A SERVER ACTION FOR THE POST REQUEST
export const action: ActionFunction = async({request}) => {
    if (request.method === "POST") {
		return addNoteServer(request)
	} else {
		throw json(
			{ error: "Wrong HTTP method for this server route" },
			{ status: 503 }
		)
	}
}

// A FUNCTION THAT RETURNS THE NOTESPAGE
export default function NotesPage(){
	// FETCHING LATEST ACTION CALL
    const APIResponse: ServerResponse | undefined = useActionData()
    // GETTING THE STATE OF A FORM SUBMISSION
    const {state: loading} = useNavigation()

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
			<Form 
                formStatus={formStatus}
                disabled={loading === "loading"}
            />
		</main>
	)
}