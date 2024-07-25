// IMPORTING NECESSARY FILES
import { describe, it, beforeEach, afterEach } from "mocha"
import {expect} from "chai"

import {
	addNote,
	deleteAllNotes,
	deleteNote,
	editNote,
	readNotes,
} from "tests/databases/helpers/notes"

describe("/notes route tests", function () {
	describe("Testing the route's loader", function () {
        beforeEach(async function(){
            console.log("Adding the seed for test database...")
            
            const firstNote = await addNote<{title: string}>({title: "First Note"}, ["title"])
            console.log(`\t1. Recorded the first note: '${firstNote?.title}'`)

            const secondNote = await addNote<{title: string}>({title: "Second Note"}, ["title"])
            console.log(`\t1. Recorded the second note: '${secondNote?.title}'`)
        })

        afterEach(async function(){
            console.log("Clearing the test database...")
            const deletedNotes = await deleteAllNotes(["id"])
            console.log(`\tDeleted ${deletedNotes?.length} notes successfully`)
        })

        it("should pass", function(){
            expect(true).equal(true)
        })
    })

	describe("Testing the route's actions", function () {
        beforeEach(async function(){
            console.log("Adding the seed for test database...")
            
            const firstNote = await addNote<{title: string}>({title: "First Note"}, ["title"])
            console.log(`\t1. Recorded the first note: '${firstNote?.title}'`)

            const secondNote = await addNote<{title: string}>({title: "Second Note"}, ["title"])
            console.log(`\t1. Recorded the second note: '${secondNote?.title}'`)
        })

        afterEach(async function(){
            console.log("Clearing the test database...")
            const deletedNotes = await deleteAllNotes(["id"])
            console.log(`\tDeleted ${deletedNotes?.length} notes successfully`)
        })

        it("should pass", function () {
			expect(true).equal(true)
		})
    })
})
