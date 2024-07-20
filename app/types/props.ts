// PROPS FOR THE NOTE COMPONENT
export type NoteProps = { 
    index: number,
    handleEdit(): void,
    handleDelete(): void,
    date: string,
    title: string,
    content: string | null
}