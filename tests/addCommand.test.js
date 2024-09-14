import { describe, it, beforeEach, afterEach, expect, vi } from "vitest"
const { EOL } = require("node:os")
import { deleteSaveFile, readSaveFileContent } from "./testUtil.js"
const { main } = require("../index.js")

describe("add command", async () => {
  beforeEach(() => {
    deleteSaveFile()
  })

  afterEach(() => {
    deleteSaveFile()
  })

  function mockStdinAndStdout() {
    const stdin = require("mock-stdin").stdin()
    const { stdout } = require("stdout-stderr")
    stdout.start()
    stdout.print = true
    return { stdin, stdout }
  }

  it.sequential("should add one task to JSON save file", async () => {
    const { stdin } = mockStdinAndStdout()
    async function onExit() {
      const saveFileData = readSaveFileContent()
      const taskEntries = JSON.parse(saveFileData)
      expect(taskEntries.length).toBe(1, "Save file should have one new task")
      expect(saveFileData).toMatch(
        /"createdAt":/,
        "Save file should have one new task with createdAt field"
      )
      expect(saveFileData).toMatch(
        /"updatedAt":null/,
        "Save file should have one new task with updatedAt field of null"
      )
      expect(saveFileData).toMatch(
        /"id":"1","description":"Buy groceries"/,
        "Save file should have description of task"
      )
    }
    const callback = async () => await onExit()
    main(callback)
    stdin.send('add "Buy groceries"')
    stdin.end()
    await vi.waitFor(callback)
  })

  it.sequential("should allow multiple tasks to be added", async () => {
    const { stdin } = mockStdinAndStdout()
    async function onExit() {
      const saveFileData = readSaveFileContent()
      const taskEntries = JSON.parse(saveFileData)
      expect(taskEntries.length).toBe(
        3,
        "Save file should have three new tasks"
      )
      expect(saveFileData).toMatch(
        /"id":"1","description":"FIRST'_'TASK"/,
        "Save file should have description of first task"
      )
      expect(saveFileData).toMatch(
        /"id":"2","description":"second    task"/,
        "Save file should have description of first task"
      )
      expect(saveFileData).toMatch(
        /"id":"3","description":"third  =  task"/,
        "Save file should have description of first task"
      )
    }
    const callback = async () => await onExit()
    main(callback)
    stdin.send(`add "FIRST'_'TASK"` + EOL)
    stdin.send('add "second    task"' + EOL)
    stdin.send(' add      "  third  =  task "   ' + EOL)
    stdin.end()
    await vi.waitFor(callback)
  })

  it.sequential(
    "should display invalid command message to user when invalid command is given",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        expect(stdout.output).toMatch(
          new RegExp(String.raw`Invalid Command \[${invalidCommand}\] given.`),
          "Invalid Command message should be displayed to user"
        )
        expect(stdout.output).toMatch(
          /List of valid commands:/,
          "Invalid Command message list of commands should be displayed to user"
        )
      }
      const invalidCommand = 'add" "Buy groceries"'
      const callback = async () => await onExit()
      main(callback)
      stdin.send(invalidCommand)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )

  it.sequential(
    "should not allow add command with more than two double quote present",
    async () => {
      const { stdin, stdout } = mockStdinAndStdout()
      async function onExit() {
        expect(stdout.output).toMatch(
          new RegExp(String.raw`Invalid Command \[${invalidCommand}\] given.`),
          "Invalid Command message should be displayed to user"
        )
      }
      const invalidCommand = 'add "Buy groceries" test"'
      const callback = async () => await onExit()
      main(callback)
      stdin.send(invalidCommand)
      stdin.end()
      stdout.stop()
      await vi.waitFor(callback)
    }
  )
})
