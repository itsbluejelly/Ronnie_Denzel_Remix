// IMPORTING NECESSARY FILES
// IMPORTING MODULES
import { PrismaClient } from "@prisma/client"
import parsedEnv from "./envSchema"

// Declaring a temporary and permanent prisma client to ensure one instance is exported
let declaredPrismaClient: PrismaClient
let temporaryPrismaClient: PrismaClient | undefined

if(parsedEnv.NODE_ENV === "production"){
	declaredPrismaClient = new PrismaClient()
	declaredPrismaClient.$connect()
}else{
	if(!temporaryPrismaClient){
		temporaryPrismaClient = new PrismaClient()
		temporaryPrismaClient.$connect()
	}

	declaredPrismaClient = temporaryPrismaClient
}

export default declaredPrismaClient