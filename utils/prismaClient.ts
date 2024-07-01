// IMPORTING NECESSARY FILES
    // IMPORTING MODULES
import {PrismaClient} from "@prisma/client"

// Declaring a variable to be tracked and exported as the client
let declaredPrismaClient: PrismaClient

if(process.env.NODE_ENV === "production"){
    declaredPrismaClient = new PrismaClient()
    declaredPrismaClient.$connect()
}else{
    if(!Prisma.declaredPrismaClient){
        Prisma.declaredPrismaClient = new PrismaClient();
        (Prisma.declaredPrismaClient as PrismaClient).$connect()
    }

    declaredPrismaClient = Prisma.declaredPrismaClient
}

export default declaredPrismaClient


