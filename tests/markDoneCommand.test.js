import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
const { EOL } = require("node:os")
import { deleteSaveFile, readSaveFileContent } from "./testUtil.js"
import { main } from "../index.js"

describe("mark done command", async () => {
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
    "should mark first todo task status to done status and change task updatedAt to not null",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        const saveFileData = readSaveFileContent()
        expect(saveFileData).toMatch(
          /\"status\":\"done\"/,
          "Save data should have updated task status from todo to done"
        )
        expect(saveFileData).not.toMatch(
          /\"updatedAt\":null/,
          "Save data should have updated task updatedAt from null to some value"
        )
        expect(stdout.output).toMatch(
          new RegExp(String.raw`Marked Task 1 as done`),
          "Should display user message that task one is marked as done"
        )
      }
      const callback = async () => await onExit()
      main(callback)
      stdin.send(`add "first task"` + EOL)
      stdin.send(`mark-done 1` + EOL)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )

  it.sequential(
    "should not mark task as done with negative index",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        const saveFileData = readSaveFileContent()
        expect(saveFileData).toMatch(
          /\"status\":\"todo\"/,
          "Save data should not have updated task status from todo to done"
        )
        expect(saveFileData).toMatch(
          /\"updatedAt\":null/,
          "Save data should not have updated task updatedAt from null"
        )
        expect(stdout.output).toMatch(
          /Invalid index provided \[-1\]/,
          "Invalid index message should be displayed to user"
        )
      }
      const callback = async () => await onExit()
      main(callback)
      stdin.send(`add "first task"` + EOL)
      stdin.send(`mark-done -1` + EOL)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )

  it.sequential(
    "should not mark task as done with index greater than task list size",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        const saveFileData = readSaveFileContent()
        expect(saveFileData).toMatch(
          /\"status\":\"todo\"/,
          "Save data should not have updated task status from todo to done"
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
      stdin.send(`mark-done 2` + EOL)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )

  it.sequential(
    "should not show invalid command with multiple space between command and index",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        const saveFileData = readSaveFileContent()
        expect(saveFileData).toMatch(
          /\"status\":\"done\"/,
          "Save data should have updated task status from todo to done"
        )
        expect(saveFileData).not.toMatch(
          /\"updatedAt\":null/,
          "Save data should have updated task updatedAt from null to some value"
        )
        expect(stdout.output).not.toMatch(
          /Invalid Command/,
          "Invalid Command message should not be displayed to user"
        )
        expect(stdout.output).toMatch(
          /Marked Task 1 as done/,
          "Should display user message that task one is marked as done"
        )
      }
      const callback = async () => await onExit()
      main(callback)
      stdin.send(`add "first task"` + EOL)
      stdin.send(`mark-done    1  ` + EOL)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )
})
