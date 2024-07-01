// IMPORTING NECESSARY FILES
	// IMPORTING MODULES
import { useFetcher } from "@remix-run/react"
	// IMPORTING PROPS
import { FormProps } from "~/types/props"
	// IMPORTING TYPES
import { ServerResponse } from "~/types/types"

// EXPORTING A FORM COMPONENT
export default function Form({
	disabled,
	handleClick,
	formData,
	formMode,
	handleChange,
}: FormProps) {
	// DEFINING A FETCHER THE FORM SHOULD USE
	const Fetcher = useFetcher<ServerResponse>()

	return (
		<Fetcher.Form
			id="note-form"
			method={formMode === "add" ? "POST" : "PATCH"}
			action="/notes"
			onSubmit={() => handleClick()}
		>
			{formMode === "edit" && <input
				type="hidden"
				name="ID"
				value={formData.ID}
				onChange={(e) => handleChange(e)}
			/>}

			<div>
				<label htmlFor="title">Title</label>
				<input
					type="text"
					id="title"
					name="title"
					required
					value={formData.title}
					onChange={(e) => handleChange(e)}
				/>
			</div>

			<div>
				<label htmlFor="content">Content</label>
				<textarea
					id="content"
					name="content"
					rows={5}
					onChange={(e) => handleChange(e)}
					value={formData.content}
				/>
			</div>

			<div className="form-actions">
				<button
					className="form-actions--button"
					disabled={disabled}>
					{disabled ? "Loading..." : formMode === "add" ? "Add note" : "Edit note"}
				</button>
			</div>
		</Fetcher.Form>
	)
}