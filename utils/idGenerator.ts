// IMPORT NECESSARY FILES
import crypto from "crypto"

/**
 * A function to generate a random ID
 */
export const generateID = (encoding: BufferEncoding = "hex"): string =>
	crypto.randomBytes(16).toString(encoding)
