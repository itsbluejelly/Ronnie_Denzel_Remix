/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { RemixBrowser } from "@remix-run/react"
import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"

/** A function that is used to set up the mock browser */
async function setupMockBrowser(){
    console.log("Setting up mock browser...📡")

    if(import.meta.env.VITE_TEST_MODE === "TRUE" && import.meta.env.DEV){
		const {mockBrowser} = await import("../tests/browser")
		return mockBrowser.start()
    }else{
        console.error("\tSorry, you opted out of test mode or the app is in production😢")
        return Promise.resolve()
    }
}

setupMockBrowser().then(() => {
	console.log("\tBrowser set up successfully")

	startTransition(() => {
		hydrateRoot(
			document,
			<StrictMode>
				<RemixBrowser />
			</StrictMode>
		)
	})
})
