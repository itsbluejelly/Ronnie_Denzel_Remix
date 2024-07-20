// IMPORTING NECESSARY TYPES
// IMPORT TYPES
import type { Note as NoteType } from "@prisma/client"
// IMPORT GENERICS
import type { OptionalGenerator } from "~/types/generics"
// IMPORT MODULES
import path from "path"
import fs from "fs/promises"
import { generateID } from "utils/database"
import z from "zod"
// IMPORT SCHEMAS
import { noteSchema } from "utils/schemas"

// Declaring the global variables to be used within the file
const filePath: string = path.join(__dirname, "..", "notes.json")
const noteIDSchema = z.object({
	id: z.string({ message: "The id param must be a valid string" }),
})
const noteAndIDSchema = noteIDSchema.and(noteSchema.partial())

/**
 * A function that is used to add a note to the mock database
 * @param fields The fields to return from the new note
 * @param note The new note to include
 */
export async function addNote<ReturnType extends OptionalGenerator<NoteType>>(
	note: z.infer<typeof noteSchema>,
	fields: (keyof NoteType)[] = [
		"content",
		"title",
		"id",
		"createdAt",
		"updatedAt",
	]
) {
	try {
		const submission = noteSchema.safeParse(note)
		if (!submission.success) throw new Error(submission.error.message)

		// Get the old notes
		const { notes: oldNotes } = JSON.parse(
			await fs.readFile(filePath, { encoding: "utf-8" })
		) as { notes: NoteType[] }

		// Create the new note
		const newNote: NoteType = {
			title: note.title,
			content: note.content ?? "",
			createdAt: new Date(),
			updatedAt: new Date(),
			id: generateID(),
		}

		// Store the result in the db
		const newNotes: NoteType[] = [newNote, ...oldNotes]

		await fs.writeFile(
			filePath,
			JSON.stringify({ notes: newNotes }, null, 4),
			{
				encoding: "utf-8",
			}
		)

		console.log(`New note created successfully: ${newNote.id}`)

		// Return the created note with the required fields
		const returnedNote: ReturnType = Object()
		for (const key of fields)
			returnedNote[key] = newNote[key] as string & Date

		return returnedNote
	} catch (error: unknown) {
		console.error(`${(error as Error).name}: ${(error as Error).message}`)
	}
}

/**
 * A function that is used to get all notes from the mock database
 * @param fields The fields to return in each of the returned note, instead of the whole note
 * @param sortObject The object that declares how to sort things
 */
export async function readNotes<ReturnType extends OptionalGenerator<NoteType>>(
	fields: (keyof NoteType)[] = [
		"content",
		"title",
		"id",
		"createdAt",
		"updatedAt",
	],

	sortObject?: {
		key: keyof NoteType
		method: "asc" | "desc"
	}
) {
	try {
		// Get the notes
		const { notes } = JSON.parse(
			await fs.readFile(filePath, { encoding: "utf-8" })
		) as { notes: NoteType[] }

		console.log(
			`${notes.length} note${
				notes.length === 1 ? null : "s"
			} obtained successfully`
		)

		// Sort the notes in the order required
		const sortedNotes: NoteType[] = notes

		if (sortObject) {
			const { key, method } = sortObject

			sortedNotes.sort((noteA, noteB) => {
				if (key === "createdAt" || key === "updatedAt") {
					return (
						new Date(noteA[key]).getTime() -
						new Date(noteB[key]).getTime()
					)
				} else {
					return (noteA[key] as string).localeCompare(noteB[key]!)
				}
			})

			if (method === "desc") {
				sortedNotes.reverse()
			}
		}

		// Convert the notes to have the required fields
		const returnedNotes: ReturnType[] = sortedNotes.map((note) => {
			const noteObject: ReturnType = Object()

			for (const key of fields) {
				noteObject[key] = note[key] as string & Date
			}

			return noteObject
		})

		return returnedNotes
	} catch (error: unknown) {
		console.error(`${(error as Error).name}: ${(error as Error).message}`)
	}
}

/**
 * A function that is used to edit a note from the mock database
 * @param filter The object containing the details of the old note
 * @param newNote The object with the new details to replace the old note
 * @param fields The fields to return in the edited note
 */
export async function editNote<ReturnType extends OptionalGenerator<NoteType>>(
	filter: z.infer<typeof noteAndIDSchema>,
	newNote: OptionalGenerator<z.infer<typeof noteSchema>>,
	fields: (keyof NoteType)[] = [
		"content",
		"title",
		"id",
		"createdAt",
		"updatedAt",
	]
) {
	try {
		const submission = noteAndIDSchema.safeParse(filter)
		if (!submission.success) throw new Error(submission.error.message)

		// Get the old notes
		const { notes: oldNotes } = JSON.parse(
			await fs.readFile(filePath, { encoding: "utf-8" })
		) as { notes: NoteType[] }

		// Get the old note that matches the old note filter
		const oldNote: NoteType | undefined = oldNotes.find((note) => {
			let isFound: boolean = false

			for (const key in filter) {
				const typedKey = key as keyof typeof filter

				if (note[typedKey] === filter[typedKey]) {
					isFound = true
				} else {
					continue
				}
			}

			return isFound
		})

		if (!oldNote) {
			throw new Error("Sorry, the note cannot be found")
		}

		// Edit the oldNote, and add it to the db
		const editedNote: NoteType = { ...oldNote, ...newNote }

		const editedNotes = oldNotes.map((note) =>
			note.id === editedNote.id ? editedNote : note
		)

		await fs.writeFile(
			filePath,
			JSON.stringify({ notes: editedNotes }, null, 4),
			{
				encoding: "utf-8",
			}
		)

		console.log(`Note updated successfully: ${editedNote.id}`)

		// Return the note with the required fields
		const returnedNote: ReturnType = Object()
		for (const key of fields)
			returnedNote[key] = editedNote[key] as string & Date

		return returnedNote
	} catch (error: unknown) {
		console.error(`${(error as Error).name}: ${(error as Error).message}`)
	}
}

/**
 * A function that is used to delete a note from the mock database
 * @param filter The object containing the details of the old note
 * @param fields The fields to return in the edited note
 */
export async function deleteNote<
	ReturnType extends OptionalGenerator<NoteType>
>(
	filter: z.infer<typeof noteAndIDSchema>,
	fields: (keyof NoteType)[] = [
		"id",
		"content",
		"createdAt",
		"updatedAt",
		"title",
	]
) {
	try {
		const submission = noteAndIDSchema.safeParse(filter)
		if (!submission.success) throw new Error(submission.error.message)

		// Get the old notes
		const { notes: oldNotes } = JSON.parse(
			await fs.readFile(filePath, { encoding: "utf-8" })
		) as { notes: NoteType[] }

		// Get the old note that matches the old note filter
		const oldNote: NoteType | undefined = oldNotes.find((note) => {
			let isFound: boolean = false

			for (const key in filter) {
				const typedKey = key as keyof typeof filter

				if (note[typedKey] === filter[typedKey]) {
					isFound = true
				} else {
					continue
				}
			}

			return isFound
		})

		if (!oldNote) {
			throw new Error("Sorry, the note cannot be found")
		}

		// delete the note from the db
		const retainedNotes: NoteType[] = oldNotes.filter(
			(note) => note.id !== oldNote.id
		)

		await fs.writeFile(
			filePath,
			JSON.stringify({ notes: retainedNotes }, null, 4),
			{
				encoding: "utf-8",
			}
		)

		console.log(`Note deleted successfully: ${oldNote.id}`)

		// Return the note with the required fields
		const deletedNote: ReturnType = Object()
		for (const key of fields)
			deletedNote[key] = oldNote[key] as string & Date

		return deletedNote
	} catch (error: unknown) {
		console.error(`${(error as Error).name}: ${(error as Error).message}`)
	}
}

/**
 * A function that is used to delete all notes from the mock database
 * @param fields The fields to return in each of the deleted notes, instead of the whole note
 */
export async function deleteAllNotes<
	ReturnType extends OptionalGenerator<NoteType>
>(
	fields: (keyof NoteType)[] = [
		"id",
		"content",
		"createdAt",
		"updatedAt",
		"title",
	]
) {
	try {
		// Get the old notes
		const { notes } = JSON.parse(
			await fs.readFile(filePath, { encoding: "utf-8" })
		) as { notes: NoteType[] }

		// delete all notes from the db
		await fs.writeFile(filePath, JSON.stringify({ notes: [] }, null, 4), {
			encoding: "utf-8",
		})

		console.log(
			`${notes.length} note${
				notes.length === 1 ? null : "s"
			} deleted successfully`
		)

		// Return the deleted notes with the required fields
		const deletedNotes: ReturnType[] = notes.map((note) => {
			const noteObject: ReturnType = Object()
			for (const key of fields)
				noteObject[key] = note[key] as string & Date

			return noteObject
		})

		return deletedNotes
	} catch (error: unknown) {
		console.error(`${(error as Error).name}: ${(error as Error).message}`)
	}
}
