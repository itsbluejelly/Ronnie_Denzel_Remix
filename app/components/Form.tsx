// IMPORTING NECESSARY FILES
	// IMPORTING PROPS
import { FormProps } from "~/types/props"

// EXPORTING A FORM COMPONENT
export default function Form({formData, handleClick, handleFormData, disabled}: FormProps){
    return (
		<form id="note-form">
			<div>
				<label htmlFor="title">Title</label>
				<input
					type="text"
					id="title"
					name="title"
					required
					value={formData.title}
					onChange={(e) => handleFormData(e)}
				/>
			</div>

			<div>
				<label htmlFor="content">Content</label>
				<textarea
					id="content"
					name="content"
					rows={5}
					value={formData.content}
					onChange={(e) => handleFormData(e)}
				/>
			</div>

			<div className="form-actions">
				<button 
					onClick={() => handleClick()}
					disabled={disabled}
				>Add Note</button>
			</div>
		</form>
	)
}