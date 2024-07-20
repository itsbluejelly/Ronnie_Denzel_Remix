// IMPORTING NECESSARY FILES
import handlers from "./databases/handlers/notes"
import { setupWorker } from "msw/browser"

// A worker that is set up for testing using msw
export const mockWorker = setupWorker(...handlers)

/**
 * A function to set up the msw worker
 */
export function setupMockWorker() {
	console.log("Setting up msw worker...♦")

	if (
		process.env.TEST_MODE !== "TRUE" &&
		process.env.NODE_ENV === "production"
	) {
		console.error("\tSorry, you opted out of test mode")

		return
	} else {
		console.log("\tWorker set up successfully🎉")
		return mockWorker.start()
	}
}

/**
 * A function to remove the msw worker
 */
export const closeMockWorker = () => {
	console.log("Closing the msw worker...♦")
	mockWorker.stop()
	console.log("\tWorker closed successfully, nice testing🎉")
}
