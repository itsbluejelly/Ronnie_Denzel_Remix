// A TYPE FOR THE PAGE STATUS
export type PageStatusType = {
	isOpen: boolean
	pageMode: "edit" | "add"
	rootError: string
	rootSuccess: string
	currentID: string
}
