import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
const { EOL } = require("node:os")
import { deleteSaveFile, readSaveFileContent } from "./testUtil.js"
import { main } from "../index.js"

describe("mark in progress command", async () => {
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
    "should mark first todo task status to in-progress status and change task updatedAt to not null",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        const saveFileData = readSaveFileContent()
        expect(saveFileData).toMatch(
          /\"status\":\"in-progress\"/,
          "Save data should have updated task status from todo to in-progress"
        )
        expect(saveFileData).not.toMatch(
          /\"updatedAt\":null/,
          "Save data should have updated task updatedAt from null to some value"
        )
        expect(stdout.output).toMatch(
          new RegExp(String.raw`Marked Task 1 as in-progress`),
          "Should display user message that task one is marked as in-progress"
        )
      }
      const callback = async () => await onExit()
      main(callback)
      stdin.send(`add "first task"` + EOL)
      stdin.send(`mark-in-progress 1` + EOL)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )

  it.sequential(
    "should not mark task as in-progress with negative index",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        const saveFileData = readSaveFileContent()
        expect(saveFileData).toMatch(
          /\"status\":\"todo\"/,
          "Save data should have not updated task status from todo"
        )
        expect(saveFileData).toMatch(
          /\"updatedAt\":null/,
          "Save data should not have updated task updatedAt from null"
        )
        expect(stdout.output).not.toMatch(
          new RegExp(String.raw`Marked Task 1 as in-progress`),
          "Should not display user message that task one is marked as in-progress"
        )
        expect(stdout.output).toMatch(
          /Invalid index provided \[-1\]/,
          "Invalid index message should be displayed to user"
        )
      }
      const callback = async () => await onExit()
      main(callback)
      stdin.send(`add "first task"` + EOL)
      stdin.send(`mark-in-progress -1` + EOL)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )

  it.sequential(
    "should not mark task as in-progress with index greater than task list",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        const saveFileData = readSaveFileContent()
        expect(saveFileData).toMatch(
          /\"status\":\"todo\"/,
          "Save data should have not updated task status from todo"
        )
        expect(saveFileData).toMatch(
          /\"updatedAt\":null/,
          "Save data should not have updated task updatedAt from null"
        )
        expect(stdout.output).toMatch(
          /Invalid index provided \[2\]/,
          "Invalid index message should be displayed to user"
        )
      }
      const callback = async () => await onExit()
      main(callback)
      stdin.send(`add "first task"` + EOL)
      stdin.send(`mark-in-progress 2` + EOL)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )
})
