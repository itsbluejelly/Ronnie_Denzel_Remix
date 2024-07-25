// IMPORT NECESSARY FILES
import { PrismaClient as SqlitePrismaClient } from "@prisma/@prisma-sqlite"

/**
 * We are importing the SQlite client instead of the actual one or the global one that references the Mongo client so as to prevent using the actual client for testing. We know its testing hence no need for fake data
 */
const prisma = new SqlitePrismaClient()

describe("Testing /notes server functions", () => {
	describe("Testing /notes actions", () => {
		beforeAll(async () => prisma.$connect())
		afterAll(async () => prisma.$disconnect())

		beforeEach(async () => {
			console.log("Creating a new note...")

			const note = await prisma.note.create({
				data: {
					title: "First Note",
					content: "First content",
				},

				select: { id: true },
			})

			console.log(`\tNote created, ID: ${note.id}`)
		})

		afterEach(async () => {
			console.log("Deleting previous note instances...")
			const { count } = await prisma.note.deleteMany()
			console.log(`\tDeletion complete: deleted ${count} notes`)
		})

        it("Should be true", () => expect(true).toBeTruthy())
	})

	describe("Testing /notes loader", () => {
		beforeAll(async () => prisma.$connect())
		afterAll(async () => prisma.$disconnect())

		beforeEach(async () => {
			console.log("Creating a new note...")

			const note = await prisma.note.create({
				data: {
					title: "First Note",
					content: "First content",
				},

				select: { id: true },
			})

			console.log(`\tNote created, ID: ${note.id}`)
		})

		afterEach(async () => {
			console.log("Deleting previous note instances...")
			const { count } = await prisma.note.deleteMany()
			console.log(`\tDeletion complete: deleted ${count} notes`)
		})

        it("Should be true", () => expect(true).toBeTruthy())
	})
})
