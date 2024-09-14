import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
const { EOL } = require("node:os")
import { deleteSaveFile, readSaveFileContent } from "./testUtil.js"
import { main } from "../index.js"

describe("update command", async () => {
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

  it.sequential(
    "should update task description and change task updatedAt to not null",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        const saveFileData = readSaveFileContent()
        expect(saveFileData).toMatch(
          /\"status\":\"todo\"/,
          "Save data should still have task status todo"
        )
        expect(saveFileData).not.toMatch(
          /\"updatedAt\":null/,
          "Save data should have updated task updatedAt from null to some value"
        )
        expect(saveFileData).toMatch(
          /\"description\":\"test new description\"/,
          "Save data should have updated task description"
        )
        expect(stdout.output).toMatch(
          new RegExp(String.raw`Updated Task 1 Description`),
          "Should display user message that task description is updated"
        )
      }
      const callback = async () => await onExit()
      main(callback)
      stdin.send(`add "first task"` + EOL)
      stdin.send(`update 1 "test new description"` + EOL)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )

  it.sequential(
    "should not update task description for negative index",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        const saveFileData = readSaveFileContent()
        expect(saveFileData).toMatch(
          /\"status\":\"todo\"/,
          "Save data should still have task status todo"
        )
        expect(saveFileData).toMatch(
          /\"updatedAt\":null/,
          "Save data should still have task updatedAt of null"
        )
        expect(saveFileData).not.toMatch(
          /\"description\":\"test new description\"/,
          "Save data should not have updated task description"
        )
        expect(stdout.output).not.toMatch(
          new RegExp(String.raw`Updated Task 1 Description`),
          "Should not display user message that task description is updated"
        )
        expect(stdout.output).toMatch(
          /Invalid index provided \[\-1\]/,
          "Should display invalid index message to user"
        )
      }
      const callback = async () => await onExit()
      main(callback)
      stdin.send(`add "first task"` + EOL)
      stdin.send(`update -1 "test new description"` + EOL)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )

  it.sequential(
    "should not update task description for index exceeding task list",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        const saveFileData = readSaveFileContent()
        expect(saveFileData).toMatch(
          /\"status\":\"todo\"/,
          "Save data should still have task status todo"
        )
        expect(saveFileData).toMatch(
          /\"updatedAt\":null/,
          "Save data should still have task updatedAt of null"
        )
        expect(saveFileData).not.toMatch(
          /\"description\":\"test new description\"/,
          "Save data should not have updated task description"
        )
        expect(stdout.output).not.toMatch(
          new RegExp(String.raw`Updated Task 1 Description`),
          "Should not display user message that task description is updated"
        )
        expect(stdout.output).toMatch(
          /Invalid index provided \[2\]/,
          "Should display invalid index message to user"
        )
      }
      const callback = async () => await onExit()
      main(callback)
      stdin.send(`add "first task"` + EOL)
      stdin.send(`update 2 "test new description"` + EOL)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )
})
