// IMPORTING NECESSARY FILES
	// IMPORTING COMPONENTS
import { Form as RemixForm } from "@remix-run/react"
	// IMPORTING TYPES
import { FormProps } from "~/types/props"

// EXPORTING A FORM COMPONENT
export default function Form({disabled, handleClick}: FormProps){
    return (
		<RemixForm
			id="note-form"
			method="POST"
			action="/notes"
			onSubmit={handleClick}
		>
			<div>
				<label htmlFor="title">Title</label>
				<input
					type="text"
					id="title"
					name="title"
					required
				/>
			</div>

			<div>
				<label htmlFor="content">Content</label>
				<textarea
					id="content"
					name="content"
					rows={5}
				/>
			</div>

			<div className="form-actions">
				<button
					className="form-actions--button"
					disabled={disabled}
				>
					{disabled ? "Loading..." : "Add data"}
				</button>
			</div>
		</RemixForm>
	)
}