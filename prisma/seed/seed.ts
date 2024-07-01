// IMPORTING NECESSARY FILES
import { notes as recordedNotes } from "./seed.json"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// The function to seed the database
async function seed() {
	try {
		console.log("Initiating seeding🌱\n\tCarrying out checks...")

		// Check if the db has some values
		console.log("\t\t1. Checking if the database has some values🧐...")
		const totalNotes = await prisma.note.count()

		if (totalNotes) {
			throw new Error("The database is already occupied😐")
		}

		// Check if the env if in production
		console.log(
			"\t\t2. Checking if the database is in production mode🧐..."
		)

		if (process.env.NODE_ENV === "production") {
			throw new Error("The environment is already in production😐")
		}

		// Starting to fill the database
		console.log("\tFilling in the database⌛...")

		for (let i = 0; i < recordedNotes.length; i++) {
			const newNote = await prisma.note.create({
				data: {
					title: recordedNotes[i].title,
					content: recordedNotes[i].content,
				},

				select: {
					id: true,
					title: true,
				},
			})

			console.log(
				`\t\t${i + 1}. Note title: ${newNote.title}\nNote ID: ${
					newNote.id
				}🎉`
			)
		}

		console.log("Database seeded successfully🌱")
	} catch (error: unknown) {
		console.error(`${(error as Error).name}: ${(error as Error).message}\n`)
		await prisma.$disconnect()
	}
}

seed()
