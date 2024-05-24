// IMPORTING FILES
    // IMPORTING MODULES
import fs from "fs/promises"
import path from "path"
import {randomBytes} from "crypto"
    // IMPORTING TYPES
import { DatabaseType } from "~/types/types"
import { fileURLToPath } from "url"
// CREATING A DATABASE OBJECT
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const database: DatabaseType = { notes: path.join(__dirname, '..', 'database', 'notes.json') }
export default database

// EXPORTING A FUNCTION THAT GETS DATA FROM A DATABASE
export async function getData<DataType extends object>(
	databasePath: string,
	databaseName: keyof DatabaseType
): Promise<{data: DataType[]} | {error: string}>{
	try{
        const recordedData: string = await fs.readFile(databasePath, "utf-8")
        const data: DataType[] = JSON.parse(recordedData)[databaseName]
        if(!data) throw new Error("Data not found, wrong path given")

        return {data}
    }catch(error: unknown){
        return {error: (error as Error).message}
    }
}

// EXPORTING A FUNCTION THAT ADDS DATA TO A DATABASE
export async function addData<DataType extends object>(
	databasePath: string,
	databaseName: keyof DatabaseType,
	data: DataType
): Promise<{ message: string }> {
	try {
		// READING THE INITIAL DATA
		const recordedData: string = await fs.readFile(databasePath, "utf-8")
		const storedData: DataType[] = JSON.parse(recordedData)[databaseName]
		if (!storedData) throw new Error("Data not found, wrong path given")
		// ADDING THE DATA
		const ID: string = randomBytes(5).toString("hex")
		const newData = { [databaseName]: [{ ID, ...data }, ...storedData] }
		
        await fs.writeFile(
			databasePath,
			JSON.stringify(newData, null, 4),
			"utf-8"
		)
		
        return { message: "Data added succcessfully" }
	} catch (error: unknown) {
		return { message: (error as Error).message }
	}
}

// EXPORTING A FUNCTION THAT EDITS DATA TO A DATABASE
export async function editData<DataType extends object>(
	databasePath: string,
	databaseName: keyof DatabaseType,
	newData: DataType & { ID: string }
): Promise<{ message: string }> {
	try {
		// READING THE INITIAL DATA
		const recordedData: string = await fs.readFile(databasePath, "utf-8")
		const storedData: DataType & { ID: string }[] =JSON.parse(recordedData)[databaseName]
		if (!storedData) throw new Error("Data not found, wrong path given")
		
        // EDITING THE DATA
		const editedData = {
			[databaseName]: storedData.map((data) =>
				data.ID === newData.ID ? { ...data, ...newData } : data
			),
		}

		await fs.writeFile(
			databasePath,
			JSON.stringify(editedData, null, 4),
			"utf-8"
		)

		return { message: "Data edited succcessfully" }
	} catch (error: unknown) {
		return { message: (error as Error).message }
	}
}

// EXPORTING A FUNCTION THAT DELETES DATA FROM A DATABASE
export async function deleteData<DataType extends object>(
	databasePath: string,
	databaseName: keyof DatabaseType,
	oldData: DataType & { ID: string }
): Promise<{ message: string }> {
	try {
		// READING THE INITIAL DATA
		const recordedData: string = await fs.readFile(databasePath, "utf-8")
		const storedData: DataType & { ID: string }[] =JSON.parse(recordedData)[databaseName]
		if (!storedData) throw new Error("Data not found, wrong path given")
		
        // DELETING THE DATA
		const newData = { [databaseName]: storedData.filter(data => data.ID !== oldData.ID)}

		await fs.writeFile(
			databasePath,
			JSON.stringify(newData, null, 4),
			"utf-8"
		)

		return { message: "Data deleted succcessfully" }
	} catch (error: unknown) {
		return { message: (error as Error).message }
	}
}