// IMPORT NECESSARY FILES
import crypto from "crypto"

/**
 * A function to generate a random ID
 * @param encoding The type of encoding to convert the random hash to
 */
export const generateID = (encoding: BufferEncoding = "hex"): string =>
	crypto.randomBytes(16).toString(encoding)
