// IMPORTING NECESSARY FILES
// IMPORTING MODULES
import { http, HttpResponse } from "msw"

/** A handler to create a new note client side */
const addNoteHandler = http.post("/notes", async({request}) => {
    const response: Response = await fetch("/notes", {
        method: "POST",
        body: await request.formData()
    })

    const data = await response.json()

    return HttpResponse.json(data, {status: response.status})
})

/** A handler to read all notes client side */
const readNotesHandler = http.post("/notes", async () => {
	const response: Response = await fetch("/notes")
	const data = await response.json()

	return HttpResponse.json(data, { status: response.status })
})

/** A handler to edit a note client side */
const editNoteHandler = http.post("/notes", async ({ request }) => {
	const response: Response = await fetch("/notes", {
		method: "PATCH",
		body: await request.formData(),
	})

	const data = await response.json()

	return HttpResponse.json(data, { status: response.status })
})

/** A handler to delete a note client side */
const deleteNoteHandler = http.post("/notes", async ({ request }) => {
	const response: Response = await fetch("/notes", {
		method: "DELETE",
		body: await request.formData(),
	})

	const data = await response.json()

	return HttpResponse.json(data, { status: response.status })
})

// A variable that holds all the handlers
const handlers = [
	addNoteHandler,
	editNoteHandler,
	readNotesHandler,
	deleteNoteHandler,
]

export default handlers
