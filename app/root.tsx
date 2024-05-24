// IMPORTING NECESSARY FILES
	// IMPORTING NECESSARY COMPONENTS
import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	MetaFunction
} from "@remix-run/react";
	// IMPORTING CSS FILES
import mainStyleHref from "~/css/style.css?url"
	// IMPORTING TYPES
import { LinksFunction } from "@remix-run/node";

// EXPORTING THE META TAG FOR THE APPLICATION
export const meta: MetaFunction = () => [
  {title: "Remix tutorial"},
  {name: "Ronnie Denzel"},
  {description: "An application to learn more about remix by implementing a note manager"}
]

// EXPORTING THE MAIN STYLES OF THE PAGE
export const links: LinksFunction = () => [{
  rel: "stylesheet",
  href: mainStyleHref
}]

// EXPORTING THE LAYOUT OF THE APPLICATION
export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

// A FUNCTION THAT RETURNS THE APP ITSELF
export default function App() {
	return <Outlet />;
}
