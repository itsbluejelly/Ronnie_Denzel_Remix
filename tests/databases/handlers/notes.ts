// IMPORTING NECESSARY FILES
// IMPORTING MODULES
import { http, HttpResponse } from "msw"
// IMPORTING DB HELPERS
import {
	addNote,
	deleteAllNotes,
	deleteNote,
	editNote,
	readNotes,
} from "../helpers/notes"
// IMPORTING VALIDATORS
import { noteSchema, noteIDSchema } from "utils/schemas"
import { parseWithZod } from "@conform-to/zod"
// IMPORTING GENERICS
import type { Picker } from "~/types/generics"
// IMPORTING TYPES
import type { Note } from "@prisma/client"

/**
 * A handler to create a new note
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
 * A handler to edit a note
 */
const editNoteHandler = http.patch("/notes", async () => {
	try {
		// Get the notes
		const notes = await readNotes()
		notes?.sort(
			(noteA, noteB) =>
				(noteA.updatedAt?.getDate() ??
					noteA.createdAt?.getDate() ??
					0) -
				(noteB.updatedAt?.getDate() ?? noteB.createdAt?.getDate() ?? 0)
		)

		if (notes.length) {
			console.log({ length: notes.length })

			return json(
				{
					success: "Notes fetched successfully",
					data: notes,
					error: "",
				},

				{ status: 200, statusText: "data found" }
			)
		} else {
			console.error({ error: "Notes not found" })

			return json(
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

		return json(
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

// An array to hold all the handlers
const handlers = [addNoteHandler]

export default handlers
