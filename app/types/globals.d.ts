// IMPORT NECESSARY TYPES
import { PrismaClient } from "@prisma/client/extension"
import {type envSchemaType} from "../../utils/envSchema"

// Extending .env variables to be typesafe
declare global{
    namespace Prisma{
        let declaredPrismaClient : PrismaClient | undefined
    }
    namespace NodeJS{
        interface ProcessEnv extends envSchemaType{}
    }
}