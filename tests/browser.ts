// IMPORTING NECESSARY FILES
import handlers from "./databases/handlers/client/notes";
import {setupWorker} from "msw/browser"

// A browser that is used for testing
export const mockBrowser = setupWorker(...handlers)

/** A function that is used to close the mock browser */
export function closeMockBrowser(){
    console.log("Closing the msw browser...📡")
    mockBrowser.stop()
    console.log("\tBrowser closed successfully, happy testing🎉")
}