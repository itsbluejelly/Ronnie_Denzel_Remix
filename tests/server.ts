// IMPORTING NECESSARY FILES
import handlers from "./databases/handlers/notes";
import {setupServer} from "msw/node"

// A server that is set up for testing using msw
export const mockServer = setupServer(...handlers)

/**
 * A function to set up the msw server
 */
export function setupMockServer(){
    console.log("Setting up msw server...♦")

    if(process.env.TEST_MODE !== "TRUE" && process.env.NODE_ENV === "production"){
        console.error("\tSorry, you opted out of test mode")

        return
    }else{
        console.log("\tServer set up successfully🎉")
        return mockServer.listen()
    }
}

/**
 * A function to remove the msw server
 */
export const closeMockServer = () => {
    console.log("Closing the msw server...♦")
    mockServer.close()
    console.log("\tServer closed successfully, nice testing🎉")
}