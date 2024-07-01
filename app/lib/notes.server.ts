// IMPORTING NECESSARY FILES
import prisma from "utils/prismaClient"
import { Picker } from "~/types/generics"
import { ActionFunctionArgs, json } from "@remix-run/node"
import { noteSchema, noteIDSchema } from "utils/schemas"

// Declaring a request type
type RequestType = Picker<ActionFunctionArgs, "request">["request"]

/**
 * A function to create a new note
 * @param request The HTTP request to parse
 */
export async function addNote(request: RequestType) {
	const formData = await request.formData()

	// Validate the formData
	const submission = noteSchema.safeParse(formData)
	let { success: parseSuccess } = submission
	const { data: parsedData, error: parsedError } = submission

	try {
		if (!parseSuccess) {
			console.error({ error: parsedError?.flatten() })

			return json(
				{ error: parsedError?.flatten() },
				{ status: 400, statusText: "Bad request" }
			)
		}

		// Add the note if all is okay
		const newNote = await prisma.note.create({
			data: {
				title: parsedData?.title as string,
				content: parsedData?.content,
			},

			select: { id: true },
		})

		if (newNote.id) {
			console.log({ _id: newNote.id })

			return json(
				{ success: "New note created successfully" },
				{ status: 201, statusText: "created" }
			)
		} else {
			throw new Error("An error during creation occured")
		}
	} catch (error: unknown) {
		parseSuccess = false

		parsedError?.addIssue({
			path: [""],
			code: "custom",
			message: error
				? `${(error as Error).name}: ${(error as Error).message}`
				: "An internal server error occured",
		})

		console.error({ error: parsedError?.flatten() })

		return json({ error: parsedError?.flatten() }, { status: 400 })
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
			console.error({ error: "Notes not found", data: [] })

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
			},

			{ status: 400, statusText: "Bad request" }
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
	const submission = formSchema.safeParse(formData)
	let { success: parseSuccess } = submission
	const { data: parsedData, error: parsedError } = submission

	try {
		if (!parseSuccess) {
			console.error({ error: parsedError?.flatten() })

			return json(
				{ error: parsedError?.flatten() },
				{ status: 400, statusText: "Bad request" }
			)
		}

		// Update the note if all is okay
		const updatedNote = await prisma.note.update({
			where: { id: parsedData?._id },

			data: {
				title: parsedData?.title,
				content: parsedData?.content,
			},

			select: { id: true },
		})

		if (updatedNote.id) {
			console.log({ _id: updatedNote.id })

			return json(
				{ success: "Note updated successfully" },
				{ status: 200, statusText: "updated successfully" }
			)
		} else {
			throw new Error("An error during creation occured")
		}
	} catch (error: unknown) {
		parseSuccess = false

		parsedError?.addIssue({
			path: [""],
			code: "custom",
			message: error
				? `${(error as Error).name}: ${(error as Error).message}`
				: "An internal server error occured",
		})

		console.error({ error: parsedError?.flatten() })

		return json({ error: parsedError?.flatten() }, { status: 400 })
	}
}

/**
 * A function to delete a note
 * @param request The HTTP request to parse
 */
export async function deleteNote(request: RequestType) {
	const formData = await request.formData()

	// Validate the formData
	const submission = noteIDSchema.safeParse(formData)
	let { success: parseSuccess } = submission
	const { data: parsedData, error: parsedError } = submission

	try {
		if (!parseSuccess) {
			console.error({ error: parsedError?.flatten() })

			return json(
				{ error: parsedError?.flatten() },
				{ status: 400, statusText: "Bad request" }
			)
		}

		// Delete the note if all is okay
		const deletedNote = await prisma.note.delete({
            where: {id: parsedData?._id},
            select: {id: true}
        })

		if (deletedNote.id) {
			console.log({ _id: deletedNote.id })

			return json(
				{ success: "Note deleted successfully" },
				{ status: 200, statusText: "deleted" }
			)
		} else {
			throw new Error("An error during creation occured")
		}
	} catch (error: unknown) {
		parseSuccess = false

		parsedError?.addIssue({
			path: [""],
			code: "custom",
			message: error
				? `${(error as Error).name}: ${(error as Error).message}`
				: "An internal server error occured",
		})

		console.error({ error: parsedError?.flatten() })

		return json({ error: parsedError?.flatten() }, { status: 400 })
	}
}
