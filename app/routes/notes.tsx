// IMPORTING NECESSARY FILES
    // IMPORTING COMPONENTS
import Form from "~/components/Form"
import Note from "~/components/Note"
    // IMPORTING TYPES
import { ActionFunction, json, LoaderFunction } from "@remix-run/node"
import { FormStatusType, ServerResponse } from "~/types/types"
    // IMPORTING LIB FUNCTIONS
import {
	addNote as addNoteServer,
	getNotes as getNotesServer,
} from "~/lib/serverHelpers"
    // IMPORTING MODULES
import React from "react"
import { useActionData, useNavigation, useLoaderData } from "@remix-run/react"
    // IMPORTING GUARDS
import { isNotes } from "~/types/guards"
    // IMPORTING GENERICS
import { Excluder } from "~/types/generics"

// A SERVER ACTION FOR THE NOTES ROUTE
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

// A LOADER FUNCTION FOR THE NOTES ROUTE
export const loader: LoaderFunction = ({request}) => {
    return getNotesServer(request)
}

// A FUNCTION THAT RETURNS THE NOTESPAGE
export default function NotesPage(){
	// FETCHING LATEST ACTION AND LOADER CALLS AND FORM NAVIGATION
    const APIResponse: ServerResponse | undefined = useActionData()
    const APIData: ServerResponse | undefined = useLoaderData()
    const {state: loading} = useNavigation()

        // DEFINING STATES
	// A STATE TO KEEP TRACK OF THE FORM
	const [formStatus, setFormStatus] = React.useState<FormStatusType>({
		error: "",
		success: "",
        isOpen: false
	})

    // A STATE TO KEEP TRACK OF THE SERVER STATUS
    const [serverStatus, setServerStatus] = React.useState<Excluder<FormStatusType, "isOpen">>({
		error: "",
		success: "",
	})

    // A FUNCTION THAT REURNS AN ARRAY OF NOTES
    function notesGenerator(): JSX.Element[] | void{
        if(!isNotes(APIData?.data)){
            return setServerStatus({
				success: "",
				error: "The data fetched is not of the required format",
			})
        }else{
            return APIData.data.map((data, index) => (
				<li key={data.ID} className="note">
					<Note
						ID={data.ID}
						date={data.date}
						index={index}
						title={data.title}
						content={data.content}
					/>
				</li>
			))
        }
    }

    // A USE EFFECT TO SYNC THE API RESULTS WITH THE FORM STATUS
    React.useEffect(() => {
        if(APIResponse){
            setFormStatus(prevStatus => ({
                ...prevStatus,
				error: APIResponse.error || "",
				success: APIResponse.success || "",
			}))
        }else if(APIData){
             setServerStatus({
                error: APIData.error || "",
                success: APIData.success || "",
            })
        }
    }, [APIResponse, APIData])

	return (
		<main id="content">
			{serverStatus?.error ? (
				<p className="error">{serverStatus.error}</p>
			) : formStatus.isOpen ? (
				<Form
					disabled={loading === "loading"}
					handleClick={() =>
						setFormStatus((prevState) => ({
							...prevState,
							isOpen: false,
						}))
					}
				/>
			) : (
				<>
					<ul id="note-list">{notesGenerator()!}</ul>

					{(formStatus.error || formStatus.success) && (
						<p className={formStatus.error ? "error" : "success"}>
							{formStatus.success || formStatus.error}
						</p>
					)}

					<button
						className="form-actions--button"
						onClick={() =>
							setFormStatus((prevState) => ({
								...prevState,
								isOpen: true,
							}))
						}>
						Add new note
					</button>
				</>
			)}
		</main>
	)
}