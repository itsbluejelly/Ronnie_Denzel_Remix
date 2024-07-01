// IMPORTING NECESSARY FILES
import prisma from "utils/prismaClient"
import { Picker } from "~/types/generics"
import { ActionFunctionArgs } from "@remix-run/node"

// Declaring a request type
type RequestType = Picker<ActionFunctionArgs, "request">["request"]

/**
 * A function to create a new note
 * @param request The HTTP request to parse
 */
async function addNote(request: RequestType) {
	const formData = await request.formData()

	// Validate the formData
	formDataSchema.parse()
}
