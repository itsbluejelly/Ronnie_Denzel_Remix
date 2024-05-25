// IMPORTING NECESSARY FILES
    // IMPORTING COMPONENTS
import Form from "~/components/Form"
    // IMPORTING TYPES
import { ActionFunction, json } from "@remix-run/node"
import { FormStatus, FormDataType, ServerResponse } from "~/types/types"
    // IMPORTING LIB FUNCTIONS
import { addNote as addNoteServer } from "~/lib/serverHelpers"
    // IMPORTING MODULES
import React from "react"

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
    // DEFINING STATES
        // A STATE TO KEEP TRACK OF THE FORMDATA
    const [formData, setFormData] = React.useState<FormDataType>({
        title: '',
        content: ''
    })
        // A STATE TO KEEP TRACK OF THE FORM
    const [formStatus, setFormStatus] = React.useState<FormStatus>({
        error: '',
        loading: false,
        success: ''
    })

    // A FUNCTION TO HANDLE FORM SUBMISSION
    function handleFormData(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void{
        // PREVENT DEFAULT BEHAVIOR
        event.preventDefault()

        // DECLARING VARIABLES
        const {name, value} = event.target

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }))
    }

    // A FUNCTION TO ADD A NOTE
    async function addNote(): Promise<void>{
        setFormStatus((prevStatus) => ({ ...prevStatus, loading: true }))

        try{
            const response: Response = await fetch('/notes', {
                body: JSON.stringify(formData),
                method: 'POST',
                headers: {'Content-Type':'application/json'}
            })
            
            const {error, success}: ServerResponse = await response.json()

            if (response.ok) {
                setFormStatus({
                    error: '',
                    success: success!,
                    loading: false
                })

                setFormData({ title: '', content: '' }) // Clear form data on success
            } else {
                setFormStatus({
                    success: '',
                    error: error!,
                    loading: false
                })
            }
        }catch(error: unknown){
            setFormStatus({
                success: '',
                error: (error as Error).message,
                loading: false
            })
        }
    }

    return (
		<main>
			<Form
				disabled={formStatus.loading}
				formData={formData}
				handleClick={addNote}
				handleFormData={handleFormData}
			/>

			{formStatus.loading ? (
				<p>Loading...</p>
			) : (
				<p>{formStatus.success ?? formStatus.error}</p>
			)}
		</main>
	)
}