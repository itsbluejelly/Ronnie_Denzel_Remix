// IMPORTING NECESSARY FILES
// IMPORTING MODULES
import {PrismaClient as MongoPrismaClient} from "@prisma/@prisma-mongodb"
import {PrismaClient as SqlitePrismaClient} from "@prisma/@prisma-sqlite"
import parsedEnv from "./envSchema"

// Declaring a temporary and permanent prisma client to ensure one instance is exported
let declaredPrismaClient: MongoPrismaClient | SqlitePrismaClient
let temporaryPrismaClient: SqlitePrismaClient | undefined

if(parsedEnv.NODE_ENV === "production"){
	declaredPrismaClient = new MongoPrismaClient()
	declaredPrismaClient.$connect()
}else{
	if(!temporaryPrismaClient){
		temporaryPrismaClient = new SqlitePrismaClient()
		temporaryPrismaClient.$connect()
	}

	declaredPrismaClient = temporaryPrismaClient
}

export default declaredPrismaClient as MongoPrismaClient