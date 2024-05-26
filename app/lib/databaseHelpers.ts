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
		console.log("Returning stored data---------------------------------")
        const recordedData: string = await fs.readFile(databasePath, "utf-8")
        const data: DataType[] = JSON.parse(recordedData)[databaseName]
        if(!data) throw new Error("Data not found, wrong path given")

		console.log("Data found successfully\n")
        return {data}
    }catch(error: unknown){
		console.log(`${(error as Error).name}: ${(error as Error).message}\n`)
        return {error: (error as Error).message}
    }
}

// EXPORTING A FUNCTION THAT ADDS DATA TO A DATABASE
export async function addData<DataType extends object>(
	databasePath: string,
	databaseName: keyof DatabaseType,
	data: DataType
): Promise<{ error: string } | {data: DataType & {ID: string}}> {
	try {
		// READING THE INITIAL DATA
		console.log("Adding data--------------------------------------------")
		const recordedData: string = await fs.readFile(databasePath, "utf-8")
		const oldData: DataType & { ID: string }[] = JSON.parse(recordedData)[databaseName]
		if (!oldData) throw new Error("Data not found, wrong path given")
			// ADDING THE DATA
		let ID: string = randomBytes(5).toString("hex")
		
		// eslint-disable-next-line no-constant-condition
		while(true){
			const foundData = oldData.find(data => data.ID === ID)
			
			if(foundData){
				ID = randomBytes(5).toString("hex")
			}else{
				break
			}
		}

		const newData = { ID, ...data }
		
        await fs.writeFile(
			databasePath,
			JSON.stringify({ [databaseName]: [newData, ...oldData] }, null, 4),
			"utf-8"
		)
		
		console.log("Data added successfully\n")
        return {data: newData}
	} catch (error: unknown) {
		console.log(`${(error as Error).name}: ${(error as Error).message}\n`)
		return { error: (error as Error).message }
	}
}

// EXPORTING A FUNCTION THAT EDITS DATA TO A DATABASE
export async function editData<DataType extends object>(
	databasePath: string,
	databaseName: keyof DatabaseType,
	newData: DataType & { ID: string }
): Promise<{ error: string } | {data: DataType & {ID: string}}> {
	try {
		// READING THE INITIAL DATA
		console.log("Editing data--------------------------------------------")
		const recordedData: string = await fs.readFile(databasePath, "utf-8")
		const oldData: DataType & { ID: string }[] =JSON.parse(recordedData)[databaseName]
		if (!oldData) throw new Error("Data not found, wrong path given")
		
        // EDITING THE DATA
		let editedData = oldData.find(data => data.ID === newData.ID)
		
		if (!editedData){
			throw new Error("Data doesn't exist, wrong ID given")
		}else{
			editedData = {...editedData, ...newData}
		}

		const changedData: { ID: string }[] = oldData.map((data) =>
			data.ID === editedData.ID ? editedData : data
		)

		await fs.writeFile(
			databasePath,
			JSON.stringify({notes: changedData}, null, 4),
			"utf-8"
		)

		console.log("Data edited successfully\n")
		return { data: editedData as DataType & { ID: string } }
	} catch (error: unknown) {
		console.log(`${(error as Error).name}: ${(error as Error).message}\n`)
		return { error: (error as Error).message }
	}
}

// EXPORTING A FUNCTION THAT DELETES DATA FROM A DATABASE
export async function deleteData<DataType extends object>(
	databasePath: string,
	databaseName: keyof DatabaseType,
	oldData: DataType & { ID: string }
): Promise<{ error: string } | { data: DataType & { ID: string } }> {
	try {
		// READING THE INITIAL DATA
		console.log("Deleting data--------------------------------------------")
		const recordedData: string = await fs.readFile(databasePath, "utf-8")
		const storedData: DataType & { ID: string }[] = JSON.parse(recordedData)[databaseName]
		if (!storedData) throw new Error("Data not found, wrong path given")

		// DELETING THE DATA
		const deletedData = storedData.find((data) => data.ID === oldData.ID)
		if (!deletedData) throw new Error("Data doesn't exist, wrong ID given")

		const newData = {
			[databaseName]: storedData.filter(
				(data) => data.ID !== deletedData.ID
			),
		}

		await fs.writeFile(
			databasePath,
			JSON.stringify(newData, null, 4),
			"utf-8"
		)

		console.log("Data deleted successfully\n")
		return { data: deletedData as DataType & { ID: string } }
	} catch (error: unknown) {
		console.log(`${(error as Error).name}: ${(error as Error).message}\n`)
		return { error: (error as Error).message }
	}
}