// EXPORTING A FORM COMPONENT
export default function Form(){
    return (
		<form
			method="post"
			id="note-form"
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
				<button>Add Note</button>
			</div>
		</form>
	)
}