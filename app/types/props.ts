// IMPORTING NECESSARY TYPES
import { FormDataType } from "./types";

// PROPS FOR THE FORM COMPONENT
export type FormProps = {
	formData: FormDataType
	handleClick(): void
	handleFormData(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void,
    disabled: boolean
}