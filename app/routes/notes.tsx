// IMPORTING NECESSARY FILES
    // IMPORTING COMPONENTS
import Form from "~/components/Form"
import Note from "~/components/Note"
    // IMPORTING TYPES
import { ActionFunction, json, LoaderFunction } from "@remix-run/node"
import { FormStatusType, ServerResponse, FormDataType } from "~/types/types"
    // IMPORTING LIB FUNCTIONS
import {
	addNote as addNoteServer,
	getNotes as getNotesServer,
	editNote as editNoteServer,
	deleteNote as deleteNoteServer,
} from "~/lib/serverHelpers"
    // IMPORTING MODULES
import React from "react"

import { useFetcher, useLoaderData } from "@remix-run/react"
    // IMPORTING GUARDS
import { isNotes } from "~/types/guards"
    // IMPORTING GENERICS
import { Excluder } from "~/types/generics"

// A SERVER ACTION FOR THE NOTES ROUTE
export const action: ActionFunction = async({request}) => {
    switch(request.method){
        case "POST":
            return addNoteServer(request)
        case "PATCH":
            return editNoteServer(request)
        case "DELETE":
            return deleteNoteServer(request)
        default:
            throw json(
                { error: "Wrong HTTP method for this server route" },
                { status: 503 }
            )
    }
}

// A LOADER FUNCTION FOR THE NOTES ROUTE
export const loader: LoaderFunction = ({request}) => getNotesServer(request)

// A FUNCTION THAT RETURNS THE NOTESPAGE
export default function NotesPage(){
	// FETCHING LATEST ACTION AND LOADER CALLS AND FORM NAVIGATION
    const fetcher = useFetcher<ServerResponse>({key: "notes"})
    const loading = fetcher.state
    const APIResponse = fetcher.data
    const APIData = useLoaderData<ServerResponse>()

        // DEFINING STATES
	// A STATE TO KEEP TRACK OF THE FORM STATUS
	const [formStatus, setFormStatus] = React.useState<FormStatusType>({
		error: "",
		success: "",
        isOpen: false,
        formMode: "add"
	})

    // A STATE TO KEEP TRACK OF THE SERVER STATUS
    const [serverStatus, setServerStatus] = React.useState<
		Excluder<FormStatusType, "isOpen" | "formMode">
	>({
		error: "",
		success: "",
	})

    // A STATE TO KEEP TRACK OF THE FORM
    const [formData, setFormData] = React.useState<FormDataType & {ID: string}>({
        ID: "",
        title: "",
        content: ""
    })

    // A FUNCTION TO HANDLE THE FORM DATA
    function handleFormData(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void{
        const {name, value} = e.target

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    } 

    // A FUNCTION THAT REURNS AN ARRAY OF NOTES
    function notesGenerator(): JSX.Element[] | void{
        if(!isNotes(APIData.data)){
            return setServerStatus({
				success: "",
				error: "The data fetched is not of the required format",
			})
        }else{
            return APIData.data.map((data, index) => (
				<li
					key={data.ID}
					className="note">
					<Note
						date={data.date}
						index={index}
						title={data.title}
						content={data.content}
						
                        handleEdit={() => {
                            setFormData((prevState) => ({
								...prevState,
                                ID: data.ID,
                                title: data.title
							}))

                            setFormStatus((prevState) => ({
								...prevState,
								isOpen: true,
                                formMode: "edit"
							}))
                        }}

						handleDelete={() => fetcher.submit(
								{ ID: data.ID },

								{
									action: "/notes",
									method: "DELETE",
								}
							)
						}
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
                    formMode={formStatus.formMode}
                    formData={formData}
                    handleChange={handleFormData}
					
                    handleClick={() => {
                        setFormData({
                            ID: "",
                            title: "",
                            content: ""
                        })

                        setFormStatus((prevState) => ({
							...prevState,
							isOpen: false,
						}))
                    }}
				/>
			) : (
				<>
					<ul id="note-list">{notesGenerator()!}</ul>

					{(formStatus.error || formStatus.success) && (
						<p className={formStatus.error ? "error" : "success"}>
							{formStatus.success || formStatus.error || serverStatus.success}
						</p>
					)}

					<button
						className="form-actions--button"
						
                        onClick={() =>
							setFormStatus((prevState) => ({
								...prevState,
								isOpen: true,
							}))
						}
                    >
						Add new note
					</button>
				</>
			)}
		</main>
	)
}