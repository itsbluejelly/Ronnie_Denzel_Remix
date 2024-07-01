// IMPORT NECESSARY TYPES
import {type envSchemaType} from "../../utils/envSchema"

// Extending .env variables to be typesafe
declare global{
    namespace NodeJS{
        interface ProcessEnv extends envSchemaType{}
    }
}
