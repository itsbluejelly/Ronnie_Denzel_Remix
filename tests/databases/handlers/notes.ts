// IMPORTING NECESSARY FILES
// IMPORTING MODULES
import { http, HttpResponse } from "msw"
// IMPORTING DB HELPERS
import {
	addNote,
	deleteNote,
	editNote,
	readNotes,
} from "../helpers/notes"
// IMPORTING VALIDATORS
import { noteSchema, noteIDSchema } from "utils/schemas"
import { parseWithZod } from "@conform-to/zod"

/**
 * A handler to create a new note in the fake server
 */
const addNoteHandler = http.post("/notes", async ({ request }) => {
	const formData = await request.formData()
	const submission = parseWithZod<typeof noteSchema>(formData, {
		schema: noteSchema,
	})

	try {
		if (submission.status !== "success") {
			return HttpResponse.json(
				{ reply: submission.reply() },

				{
					status: 400,
					statusText: "Bad request",
				}
			)
		}

		// Add the note if all is okay
		const newNote = await addNote<{ id: string }>(submission.value, ["id"])

		if (newNote?.id) {
			console.log({ id: newNote.id })
			return HttpResponse.redirect("/notes")
		} else {
			throw new Error("An error during creation occured")
		}
	} catch (error: unknown) {
		submission.status = "error"

		return HttpResponse.json(
			{
				reply: submission.reply({
					formErrors: [
						error
							? `${(error as Error).name}: ${
									(error as Error).message
							}`
							: "An internal server error occured",
					],
				}),
			},

			{ status: 500 }
		)
	}
})

/**
 * A handler to read notes from the fake server
 */
const readNotesHandler = http.get("/notes", async () => {
	try {
		// Get the notes
		const notes = await readNotes(undefined, {
			key: "updatedAt",
			method: "desc",
		})

		if (notes?.length) {
			console.log({ length: notes.length })

			return HttpResponse.json(
				{
					success: "Notes fetched successfully",
					data: notes,
					error: "",
				},

				{ status: 200, statusText: "data found" }
			)
		} else {
			console.error({ error: "Notes not found" })

			return HttpResponse.json(
				{
					error: "Notes not found",
					data: [],
					success: "",
				},

				{ status: 404, statusText: "data not found" }
			)
		}
	} catch (error: unknown) {
		console.error({ error })

		return HttpResponse.json(
			{
				error: error
					? `${(error as Error).name}: ${(error as Error).message}`
					: "An internal server error occured",

				data: [],
				success: "",
			},

			{ status: 500 }
		)
	}
})

/**
 * A handler to edit a note from the fake server
 */
const editNoteHandler = http.patch("/notes", async ({ request }) => {
	const formData = await request.formData()
	const formSchema = noteSchema.partial().and(noteIDSchema)

	// Validate the formData
	const submission = parseWithZod(formData, { schema: formSchema })

	try {
		if (submission.status !== "success") {
			return HttpResponse.json(
				{ reply: submission.reply() },
				{ status: 400, statusText: "Bad request" }
			)
		}

		const { id, title, content } = submission.value

		// Update the note if all is okay
		const updatedNote = await editNote<{ id: string }>(
			{ id },
			{ content, title },
			["id"]
		).catch((error: unknown) => {
			throw new Error((error as Error).message)
		})

		if (updatedNote?.id) {
			console.log({ id: updatedNote?.id })
			return HttpResponse.redirect("/notes")
		} else {
			throw new Error("An error during creation occured")
		}
	} catch (error: unknown) {
		submission.status = "error"

		return HttpResponse.json(
			{
				reply: submission.reply({
					formErrors: [
						error
							? `${(error as Error).name}: ${
									(error as Error).message
							}`
							: "An internal server error occured",
					],
				}),
			},

			{ status: 400 }
		)
	}
})

/**
 * A handler to delete a note from the fake server
 */
const deleteNoteHandler = http.delete("/notes", async ({ request }) => {
	const formData = await request.formData()
	const submission = parseWithZod<typeof noteIDSchema>(formData, {
		schema: noteIDSchema,
	})

	try {
		if (submission.status !== "success") {
			return HttpResponse.json(
				{ reply: submission.reply() },
				{ status: 400, statusText: "Bad request" }
			)
		}

		const { id } = submission.value

		// Delete the note if all is okay
		const deletedNote = await deleteNote<{ id: string }>({ id }, ["id"])

		if (deletedNote?.id) {
			console.log({ id: deletedNote?.id })
			return HttpResponse.redirect("/notes")
		} else {
			throw new Error("An error during creation occured")
		}
	} catch (error: unknown) {
		submission.status = "error"

		return HttpResponse.json(
			{
				reply: submission.reply({
					formErrors: [
						error
							? `${(error as Error).name}: ${
									(error as Error).message
							}`
							: "An internal server error occured",
					],
				}),
			},

			{ status: 500 }
		)
	}
})

// A variable that holds all the handlers
const handlers = [
	addNoteHandler,
	editNoteHandler,
	readNotesHandler,
	deleteNoteHandler,
]

export default handlers
