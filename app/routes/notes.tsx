// IMPORTING NECESSARY FILES
    // IMPORTING COMPONENTS
import Form from "~/components/Form"
import Note from "~/components/Note"
    // IMPORTING TYPES
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { FormStatusType } from "~/types/types"
    // IMPORTING MODULES
import React from "react"
import { addNote, deleteNote, readNotes, updateNote } from "~/lib/notes.server"
import { useFetcher, useLoaderData } from "@remix-run/react"
import {useForm} from "@conform-to/react"
import {getZodConstraint, parseWithZod} from "@conform-to/zod"
    // IMPORTING GUARDS
import { isNotes } from "~/types/guards"
    // IMPORTING GENERICS
import { Excluder, GetFunctionReturn } from "~/types/generics"
import { noteIDSchema, noteSchema } from "utils/schemas"
import { z } from "zod"

// A SERVER ACTION FOR THE NOTES ROUTE
export async function action({request}: ActionFunctionArgs){
    switch(request.method){
        case "PATCH":
            return updateNote(request)
        case "DELETE":
            return deleteNote(request)
        default:
            return addNote(request)
    }
}

// A LOADER FUNCTION FOR THE NOTES ROUTE
export async function loader(){
    return readNotes()
}

// A FUNCTION THAT RETURNS THE NOTESPAGE
export default function NotesPage(){
	// FETCHING LATEST ACTION AND LOADER CALLS AND FORM NAVIGATION
    const fetcher = useFetcher<typeof action>()
    const loading = fetcher.state
    const APIResponse = fetcher.data
    const APIData = useLoaderData<typeof loader>()

    // Defining the form attributes
    const formSchema = noteSchema.and(noteIDSchema.partial())
    type formType = z.infer<typeof formSchema>
    
    const [form, fields] = useForm<formType>({
        lastResult: APIResponse?.reply,
        constraint: getZodConstraint(formSchema),
        
        defaultValue: {
            content: "",
            id: "",
            title: ""
        },

        onValidate: ({formData}) => parseWithZod(formData, {schema: formSchema}),
        shouldValidate: "onBlur",
        shouldRevalidate: "onInput"
    })

        // DEFINING STATES
	// A STATE TO KEEP TRACK OF THE FORM STATUS
	const [formStatus, setFormStatus] = React.useState<FormStatusType>({
        isOpen: false,
        formMode: "add"
	})

    // A FUNCTION THAT REURNS AN ARRAY OF NOTES
    function notesGenerator(): JSX.Element[] | void{
        if(!APIData.data.length || !isNotes(APIData.data)){
            
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