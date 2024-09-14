import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
const { EOL } = require("node:os")
import { deleteSaveFile, readSaveFileContent } from "./testUtil.js"
import { main } from "../index.js"

describe("delete command", async () => {
  beforeEach(() => {
    deleteSaveFile()
  })

  afterEach(() => {
    deleteSaveFile()
  })

  function mockStdinAndStdout() {
    const stdin = require("mock-stdin").stdin()
    const { stdout } = require("stdout-stderr")
    stdout.print = true
    stdout.start()
    return { stdin, stdout }
  }

  it.sequential("should delete task", async () => {
    const { stdin, stdout } = mockStdinAndStdout()
    async function onExit() {
      const saveFileData = readSaveFileContent()
      expect(saveFileData).not.toMatch(
        /\"id\":\"1\"/,
        "Save data should have deleted task id"
      )
      expect(saveFileData).not.toMatch(
        /\"description\":\"delete task description\"/,
        "Save data should have delete task description"
      )
      expect(stdout.output).toMatch(
        new RegExp(String.raw`Deleted Task 1`),
        "Should display user message that task is deleted"
      )
    }
    const callback = async () => await onExit()
    main(callback)
    stdin.send(`add "delete task description"` + EOL)
    stdin.send(`delete 1` + EOL)
    stdin.end()
    stdout.stop()
    await vi.waitFor(callback)
  })

  it.sequential(
    "should not delete task for invalid negative index",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        const saveFileData = readSaveFileContent()
        expect(saveFileData).toMatch(
          /\"id\":\"1\"/,
          "Save data should not have deleted task id"
        )
        expect(saveFileData).toMatch(
          /\"description\":\"not deleted task description\"/,
          "Save data should not delete task description"
        )
        expect(stdout.output).not.toMatch(
          new RegExp(String.raw`Deleted Task 1`),
          "Should not display user message that task is deleted"
        )
        expect(stdout.output).toMatch(
          /Invalid index provided \[\-1\]/,
          "Should display user message that invalid negative delete index is provided"
        )
      }
      const callback = async () => await onExit()
      main(callback)
      stdin.send(`add "not deleted task description"` + EOL)
      stdin.send(`delete -1` + EOL)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )

  it.sequential(
    "should not delete task for invalid index that exceed task list length",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        const saveFileData = readSaveFileContent()
        expect(saveFileData).toMatch(
          /\"id\":\"1\"/,
          "Save data should not have deleted task id"
        )
        expect(saveFileData).toMatch(
          /\"description\":\"not deleted task description\"/,
          "Save data should not delete task description"
        )
        expect(stdout.output).not.toMatch(
          new RegExp(String.raw`Deleted Task 1`),
          "Should not display user message that task is deleted"
        )
        expect(stdout.output).toMatch(
          /Invalid index provided \[2\]/,
          "Should display user message that delete index is invalid"
        )
      }
      const callback = async () => await onExit()
      main(callback)
      stdin.send(`add "not deleted task description"` + EOL)
      stdin.send(`delete 2` + EOL)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )

  it.sequential(
    "should add new task after deletion without overriding existing tasks",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        const saveFileData = readSaveFileContent()
        const taskEntries = JSON.parse(saveFileData)
        expect(saveFileData).toMatch(
          /\"id\":\"1\",\"description\":\"not deleted task description\"/,
          "Save data should not have deleted task id one"
        )
        expect(saveFileData).toMatch(
          /\"id\":\"2\",\"description\":\"not deleted second task description\"/,
          "Save data should not have deleted task id two"
        )
        expect(saveFileData).toMatch(
          /\"id\":\"3\",\"description\":\"not deleted fourth task description\"/,
          "Save data should not have deleted task id four"
        )
        expect(saveFileData).toMatch(
          /\"id\":\"4\",\"description\":\"new task description\"/,
          "Save data should have added new task after deletion"
        )
        expect(saveFileData).not.toMatch(
          /\"id\":\"5\"/,
          "Save data should not have id = 5"
        )
        expect(taskEntries.length).toBe(
          4,
          "Save data should not have five tasks"
        )
        expect(stdout.output).toMatch(
          new RegExp(String.raw`Deleted Task 3`),
          "Should display user message that task is deleted"
        )
      }
      const callback = async () => await onExit()
      main(callback)
      stdin.send(`add "not deleted task description"` + EOL)
      stdin.send(`add "not deleted second task description"` + EOL)
      stdin.send(`add "deleted third task description"` + EOL)
      stdin.send(`add "not deleted fourth task description"` + EOL)
      stdin.send(`delete 3` + EOL)
      stdin.send(`add "new task description"` + EOL)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )
})
