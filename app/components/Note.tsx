// IMPORTING NECESSARY FILES
// IMPORTING PROPS
import { NoteProps } from "~/types/props"
// IMPORTING COMPONENTS
import { Form } from "@remix-run/react"

// A FUNCTION TO RETURN A NOTE COMPONENT
export default function Note({
	date,
	title,
	content = "",
	index,
	handleDelete,
	handleEdit,
	formData: { id },
}: NoteProps) {
	return (
		<article>
			<header>
				<ul className="note-meta">
					<li>#{index + 1}</li>

					<li>
						<time dateTime={`${date}`}>
							{new Date(date).toLocaleDateString("en-KE", {
								day: "2-digit",
								month: "short",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit",
							})}
						</time>
					</li>
				</ul>

				<h2>{title}</h2>
			</header>

			<p>{content}</p>

			<div style={{ marginTop: "5px", display: "flex" }}>
				<Form
					action="/notes"
					method="DELETE"
                    onSubmit={() => handleDelete()}
                >
                    <input type="hidden" name="id" value={id} />
					<button title="delete">🚮</button>
				</Form>

				<button
					title="edit"
					onClick={() => handleEdit()}>
					🖊
				</button>
			</div>
		</article>
	)
}
