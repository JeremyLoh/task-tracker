import { describe, it, beforeEach, afterEach, expect, vi } from "vitest"
const { EOL } = require("node:os")
import { deleteSaveFile, readSaveFileContent } from "./testUtil.js"
const { main } = require("../index.js")

describe("list command", async () => {
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
    "should list zero tasks when zero tasks are present",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        const saveFileData = readSaveFileContent()
        expect(saveFileData).toBe("", "Should have no saved tasks")
        expect(stdout.output).not.toMatch(
          /Invalid Command \[list\] given/,
          "Should not have invalid command message"
        )
        expect(stdout.output).toMatch(/No Tasks Available/)
      }
      const callback = async () => await onExit()
      main(callback)
      stdin.send(`list` + EOL)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )

  it.sequential(
    "should reject list command with invalid status keyword",
    async () => {
      const invalidListCommand = `list special`
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        expect(stdout.output).toMatch(
          new RegExp(
            String.raw`Invalid Command \[${invalidListCommand}\] given.`
          ),
          "Invalid Command message should be displayed to user"
        )
      }
      const callback = async () => await onExit()
      main(callback)
      stdin.send(invalidListCommand + EOL)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )

  it.sequential("should list two tasks after adding two tasks", async () => {
    const { stdin, stdout } = mockStdinAndStdout()
    async function onExit() {
      expect(stdout.output).toMatch(
        /1\) first task \[todo\]/,
        "Should list first task"
      )
      expect(stdout.output).toMatch(
        /2\) second task \[todo\]/,
        "Should list second task"
      )
    }
    const callback = async () => await onExit()
    main(callback)
    stdin.send(`add "first task"` + EOL)
    stdin.send(`add "second task"` + EOL)
    stdin.send(`list ` + EOL)
    stdin.end()
    stdout.stop()
    await vi.waitFor(callback)
  })
})
