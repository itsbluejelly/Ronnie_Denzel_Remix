// IMPORTING NECESSARY FILES
	// IMPORTING COMPONENTS
import { Link } from "@remix-run/react"

// A FUNCTION THAT RETURNS THE HOME PAGE
export default function Homepage(){
	return (
		<main id="content">
			<header>
				<h1>Notes App!</h1>
				<p>A new efficient way to keep track of your notes</p>
			</header>

			<p id="cta">
				<Link to="/notes">Try now</Link>
			</p>
		</main>
	)
}