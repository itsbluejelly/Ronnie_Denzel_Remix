// IMPORTING NECESSARY FILES
// IMPORTING COMPONENTS
import Note from "~/components/Note"
// IMPORTING TYPES
import { ActionFunctionArgs} from "@remix-run/node"
import { PageStatusType } from "~/types/types"
// IMPORTING MODULES
import React from "react"
import { addNote, deleteNote, readNotes, editNote } from "~/lib/notes.server"
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import {
	useForm,
	getInputProps,
	getTextareaProps,
	getFormProps,
} from "@conform-to/react"
import { getZodConstraint, parseWithZod } from "@conform-to/zod"
// IMPORTING GUARDS
import { isNotes } from "~/types/guards"
// IMPORTING GENERICS
import { noteIDSchema, noteSchema } from "utils/schemas"
import { z } from "zod"

// A SERVER ACTION FOR THE NOTES ROUTE
export async function action({ request }: ActionFunctionArgs) {
	switch (request.method) {
		case "PATCH":
			return editNote(request)
		case "DELETE":
			return deleteNote(request)
		default:
			return addNote(request)
	}
}

// A LOADER FUNCTION FOR THE NOTES ROUTE
export async function loader() {
	return readNotes()
}

// A FUNCTION THAT RETURNS THE NOTESPAGE
export default function NotesPage() {
	// FETCHING LATEST ACTION AND LOADER CALLS AND FORM NAVIGATION
	const loading = useNavigation().state
	const APIResponse = useActionData<typeof action>()
	const APIData = useLoaderData<typeof loader>()

	// Defining the form attributes
	const formSchema = noteSchema.and(noteIDSchema.partial())
	type formType = z.infer<typeof formSchema>

	const [form, fields] = useForm<formType>({
		lastResult: APIResponse?.reply,
		constraint: getZodConstraint(formSchema),

		defaultValue: {
			content: "",
			id: "",
			title: "",
		},

		shouldValidate: "onBlur",
		shouldRevalidate: "onInput",
		onValidate: ({ formData }) =>
			parseWithZod(formData, { schema: formSchema }),
	})

	// A STATE TO KEEP TRACK OF THE PAGE STATUS
	const [pageStatus, setPageStatus] = React.useState<PageStatusType>({
		isOpen: false,
		pageMode: "add",
		rootError: "",
		rootSuccess: "",
		currentID: "",
	})

	// A FUNCTION THAT REURNS AN ARRAY OF NOTES, while generating errors
	function notesGenerator(): JSX.Element[] | void {
		if (!isNotes(APIData.data)) {
			setPageStatus((prevStatus) => ({
				...prevStatus,
				rootError: APIData.error ?? "The data obtained is invalid",
				rootSuccess: "",
			}))
		} else {
			return APIData.data.map((data, index) => (
				<li
					key={data.id}
					className="note"
				>
					<Note
						date={data.createdAt}
						index={index}
						title={data.title}
						content={data.content}
						formData={{id: data.id}}
						
						handleEdit={() =>
							setPageStatus({
								currentID: data.id,
								isOpen: true,
								pageMode: "edit",
								rootError: "",
								rootSuccess: "",
							})
						}
						
						handleDelete={() => {
							setPageStatus((prevStatus) => ({
								...prevStatus,
								rootError: "",
								rootSuccess: "",
							}))
						}}
					/>
				</li>
			))
		}
	}

	// A function to generate errors
	function errorGenerator(errors: string[]): JSX.Element[] {
		return errors.map((error, index) => (
			<p
				className="error"
				key={index}>
				{error}
			</p>
		))
	}

	// A USE EFFECT TO SYNC THE API RESULTS WITH THE PAGE STATUS
	React.useEffect(() => {
		if (APIData)
			setPageStatus((prevStatus) => ({
				...prevStatus,
				rootError: APIData.error ?? "",
				rootSuccess: APIData.success ?? "",
			}))
	}, [APIData])

	return (
		<main id="content">
			{pageStatus.isOpen ? (
				<Form
					method={pageStatus.pageMode === "add" ? "POST" : "PATCH"}
					{...getFormProps(form)}>
					{pageStatus.pageMode === "edit" && (
						<>
							<div>
								<input
									{...getInputProps(fields.id, {
										type: "hidden",
										value: false,
									})}
									value={pageStatus.currentID}
								/>

								{errorGenerator(fields.id.errors || [])}
							</div>

							<div>
								<input
									{...getInputProps(fields.title, {
										type: "text",
										value: false,
									})}
									value={
										APIData.data.find(
											(item) =>
												item.id === pageStatus.currentID
										)?.title
									}
								/>

								{errorGenerator(fields.title.errors || [])}
							</div>
						</>
					)}

					{pageStatus.pageMode === "add" && <div>
						<label htmlFor={fields.title.id}>Title</label>
						<input
							{...getInputProps(fields.title, { type: "text" })}
						/>

						{errorGenerator(fields.title.errors || [])}
					</div>}

					<div>
						<label htmlFor={fields.content.id}>Content</label>
						<textarea
							{...getTextareaProps(fields.content)}
							rows={5}
						/>

						{errorGenerator(fields.content.errors || [])}
					</div>

					<div className="form-actions">
						<button
							className="form-actions--button"
							disabled={loading !== "idle"}>
							{loading !== "idle"
								? "Loading..."
								: pageStatus.pageMode === "add"
								? "Add note"
								: "Edit note"}
						</button>
					</div>
				</Form>
			) : (
				<>
					<ul id="note-list">{notesGenerator()!}</ul>

					{pageStatus.rootSuccess && (
						<p className="success">{pageStatus.rootSuccess}</p>
					)}

					{pageStatus.rootError && (
						<p className="error">{pageStatus.rootError}</p>
					)}

					<button
						className="form-actions--button"
						onClick={() =>
							setPageStatus((prevState) => ({
								...prevState,
								isOpen: true,
								rootError: "",
								rootSuccess: "",
								pageMode: "add",
							}))
						}>
						Add new note
					</button>
				</>
			)}
		</main>
	)
}
