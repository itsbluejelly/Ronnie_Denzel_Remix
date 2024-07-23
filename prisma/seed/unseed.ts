// IMPORTING NECESSARY FILES
import prisma from "utils/prismaClient"
import parsedEnv from "utils/envSchema"

// The function to unseed the database
async function unseed() {
	try {
		console.log(
			"Initiating clearing of database🌱\n\tCarrying out checks..."
		)

		// Check if the db has some values
		console.log("\t\t1. Checking if the database has some values🧐...")
		const totalNotes = await prisma.note.count()

		if (!totalNotes) {
			throw new Error("The database is already empty😐")
		}

		// Check if the env if in production
		console.log(
			"\t\t2. Checking if the database is in production mode🧐..."
		)

		if (parsedEnv.NODE_ENV === "production") {
			throw new Error("The environment is already in production😐")
		}

		// Starting to clear the database
		console.log("\tClearing the database⌛...")
		await prisma.note.deleteMany()
		console.log(`\t\tCleared ${totalNotes} notes`)

		console.log("Database cleared successfully🌱")
	} catch (error: unknown) {
		console.error(`${(error as Error).name}: ${(error as Error).message}\n`)
		await prisma.$disconnect()
	}
}

unseed()
