// IMPORTING NECESSARY FILES
import prisma from "utils/prismaClient"
import { Picker } from "~/types/generics"
import { ActionFunctionArgs, json } from "@remix-run/node"
import { noteSchema, noteIDSchema } from "utils/schemas"
import { parseWithZod } from "@conform-to/zod"

// Declaring a request type
type RequestType = Picker<ActionFunctionArgs, "request">["request"]

/**
 * A function to create a new note
 * @param request The HTTP request to parse
 */
export async function addNote(request: RequestType) {
	const formData = await request.formData()
	const submission = parseWithZod<typeof noteSchema>(formData, {schema: noteSchema})

	try {
		if (submission.status !== "success") {
			return json(
				{ reply: submission.reply() },

				{
					status: 400,
					statusText: "Bad request",
				}
			)
		}

		const { title, content } = submission.value

		// Add the note if all is okay
		const newNote = await prisma.note.create({
			data: { title, content },
			select: { id: true },
		})

		if (newNote.id) {
			console.log({ id: newNote.id })
		} else {
			throw new Error("An error during creation occured")
		}
	} catch (error: unknown) {
		submission.status = "error"

		return json(
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
}

/**
 * A function to read all the notes
 * @param request The HTTP request to parse
 */
export async function readNotes() {
	try {
		// Get the notes
		const notes = await prisma.note.findMany()

		if (notes.length) {
			console.log({ length: notes.length })

			return json(
				{ success: "Notes fetched successfully", data: notes },
				{ status: 200, statusText: "data found" }
			)
		} else {
			console.error({ error: "Notes not found" })

			return json(
				{ error: "Notes not found", data: [] },
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

				data: []
			},

			{ status: 500 }
		)
	}
}

/**
 * A function to update a note
 * @param request The HTTP request to parse
 */
export async function updateNote(request: RequestType) {
	const formData = await request.formData()
	const formSchema = noteSchema.and(noteIDSchema)

	// Validate the formData
	const submission = parseWithZod(formData, {schema: formSchema})

	try {
		if (submission.status !== "success") {
			return json(
				{ reply: submission.reply() },
				{ status: 400, statusText: "Bad request" }
			)
		}

		const {id, title, content} = submission.value

		// Update the note if all is okay
		const updatedNote = await prisma.note.update({
			where: { id },
			data: {title, content},
			select: { id: true }
		})

		if (updatedNote.id) {
			console.log({ id: updatedNote.id })
		} else {
			throw new Error("An error during creation occured")
		}
	} catch (error: unknown) {
		submission.status = "error"

		return json({
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
}

/**
 * A function to delete a note
 * @param request The HTTP request to parse
 */
export async function deleteNote(request: RequestType) {
	const formData = await request.formData()
	const submission = parseWithZod<typeof noteIDSchema>(formData, {schema: noteIDSchema})

	try {
		if (submission.status !== "success") {
			return json(
				{ reply: submission.reply() },
				{ status: 400, statusText: "Bad request" }
			)
		}

		const {id} = submission.value

		// Delete the note if all is okay
		const deletedNote = await prisma.note.delete({
			where: { id },
			select: { id: true },
		})

		if (deletedNote.id) {
			console.log({ id: deletedNote.id })
		} else {
			throw new Error("An error during creation occured")
		}
	} catch (error: unknown) {
		submission.status = "error"

		return json(
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
}
