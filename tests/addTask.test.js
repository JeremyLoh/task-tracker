import { describe, it, beforeEach, afterEach, expect } from "vitest"
const fs = require("node:fs")
const { EOL } = require("node:os")
const { main } = require("../index.js")
const { SAVE_FILE_PATH } = require("../storage/file.js")

describe("add cli task", () => {
  beforeEach(() => {
    deleteSaveFile()
  })

  afterEach(() => {
    deleteSaveFile()
  })

  function deleteSaveFile() {
    if (fs.existsSync(SAVE_FILE_PATH)) {
      fs.unlinkSync(SAVE_FILE_PATH)
    }
  }

  function readSaveFileContent() {
    return fs.readFileSync(SAVE_FILE_PATH, "utf8")
  }

  function mockStdinAndStdout() {
    const stdin = require("mock-stdin").stdin()
    const { stdout } = require("stdout-stderr")
    stdout.start()
    stdout.print = true
    return { stdin, stdout }
  }

  it("should add one task to JSON save file", async () => {
    const { stdin } = mockStdinAndStdout()
    main()
    stdin.send('add "Buy groceries"')
    stdin.end()

    const saveFileData = readSaveFileContent()
    const taskEntries = JSON.parse(saveFileData)
    await expect(taskEntries.length).toBe(
      1,
      "Save file should have one new task"
    )
    await expect(saveFileData).toMatch(
      /"createdAt":/,
      "Save file should have one new task with createdAt field"
    )
    await expect(saveFileData).toMatch(
      /"updatedAt":null/,
      "Save file should have one new task with updatedAt field of null"
    )
    await expect(saveFileData).toMatch(
      /"id":"1","description":"Buy groceries"/,
      "Save file should have description of task"
    )
  })

  it("should allow multiple tasks to be added", async () => {
    const { stdin } = mockStdinAndStdout()
    main()
    stdin.send(`add "FIRST'_'TASK"` + EOL)
    stdin.send('add "second    task"' + EOL)
    stdin.send(' add      "  third  =  task "   ' + EOL)
    stdin.end()

    const saveFileData = readSaveFileContent()
    const taskEntries = JSON.parse(saveFileData)
    await expect(taskEntries.length).toBe(
      3,
      "Save file should have three new tasks"
    )
    await expect(saveFileData).toMatch(
      /"id":"1","description":"FIRST'_'TASK"/,
      "Save file should have description of first task"
    )
    await expect(saveFileData).toMatch(
      /"id":"2","description":"second    task"/,
      "Save file should have description of first task"
    )
    await expect(saveFileData).toMatch(
      /"id":"3","description":"third  =  task"/,
      "Save file should have description of first task"
    )
  })

  it("should display invalid command message to user when invalid command is given", async () => {
    const { stdin, stdout } = mockStdinAndStdout()
    const invalidCommand = 'add" "Buy groceries"'
    main()
    stdin.send(invalidCommand)
    stdin.end()
    stdout.stop()
    await expect(stdout.output).toMatch(
      new RegExp(String.raw`Invalid Command \[${invalidCommand}\] given.`),
      "Invalid Command message should be displayed to user"
    )
    await expect(stdout.output).toMatch(
      /List of valid commands:/,
      "Invalid Command message list of commands should be displayed to user"
    )
  })

  it("should not allow add command with more than two double quote present", async () => {
    const { stdin, stdout } = mockStdinAndStdout()
    const invalidCommand = 'add "Buy groceries" test"'
    main()
    stdin.send(invalidCommand)
    stdin.end()
    stdout.stop()
    await expect(stdout.output).toMatch(
      new RegExp(String.raw`Invalid Command \[${invalidCommand}\] given.`),
      "Invalid Command message should be displayed to user"
    )
  })
})
