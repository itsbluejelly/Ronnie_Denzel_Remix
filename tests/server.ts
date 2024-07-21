// IMPORTING NECESSARY FILES
import handlers from "./databases/handlers/notes"
import { setupServer } from "msw/node"

// A server that is set up for testing using msw
const mockServer = setupServer(...handlers)

/*** A function to set up the msw server */
export function setupMockServer() {
	console.log("Setting up msw server...♦")

	if (
		process.env.VITE_TEST_MODE === "TRUE" &&
		process.env.NODE_ENV === "development"
	) {
        mockServer.listen()

        console.log("\tServer set up successfully🎉")
	} else {
		console.error("\tSorry, you opted out of test mode or the app is in production😢")
	}
}

/*** A function to remove the msw server */
export function closeMockServer(){
	console.log("Closing the msw server...♦")
	mockServer.close()
	console.log("\tServer closed successfully, nice testing🎉")
}
