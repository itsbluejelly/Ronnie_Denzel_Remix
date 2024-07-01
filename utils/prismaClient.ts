// IMPORTING NECESSARY FILES
// IMPORTING MODULES
import { PrismaClient } from "@prisma/client"

// Declaring a variable to be tracked and exported as the client
let temporaryPrismaClient: PrismaClient
let declaredPrismaClient: PrismaClient | undefined

if (process.env.NODE_ENV === "production") {
	temporaryPrismaClient = new PrismaClient()
	temporaryPrismaClient.$connect()
} else {
	if (!declaredPrismaClient) {
		declaredPrismaClient = new PrismaClient()
		declaredPrismaClient.$connect()
	}

	temporaryPrismaClient = declaredPrismaClient
}

export default temporaryPrismaClient
