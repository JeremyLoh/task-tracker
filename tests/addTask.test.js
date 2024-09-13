const { describe, it, beforeEach, after } = require("node:test")
const assert = require("node:assert")
const fs = require("node:fs")
const { main } = require("../index.js")
const { SAVE_FILE_PATH } = require("../storage/file.js")
const { EOL } = require("node:os")

describe("add cli task", () => {
  beforeEach(() => {
    deleteSaveFile()
  })

  after(() => {
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

  function assertSaveFileExists() {
    assert.strictEqual(
      fs.existsSync(SAVE_FILE_PATH),
      true,
      `Save File does not exist at ${SAVE_FILE_PATH}`
    )
  }

  function mockStdinAndStdout() {
    const stdin = require("mock-stdin").stdin()
    const { stdout } = require("stdout-stderr")
    stdout.start()
    return { stdin, stdout }
  }

  it("should add one task to JSON save file", () => {
    const { stdin } = mockStdinAndStdout()
    main()
    stdin.send('add "Buy groceries"')
    assertSaveFileExists()
    stdin.end()
    assertSaveFileExists()

    const saveFileData = readSaveFileContent()
    const taskEntries = JSON.parse(saveFileData)
    assert.strictEqual(
      taskEntries.length,
      1,
      "Save file should have one new task"
    )
    assert.match(
      saveFileData,
      /"createdAt":/,
      "Save file should have one new task with createdAt field"
    )
    assert.match(
      saveFileData,
      /"updatedAt":null/,
      "Save file should have one new task with updatedAt field of null"
    )
    assert.match(
      saveFileData,
      /"id":"1","description":"Buy groceries"/,
      "Save file should have description of task"
    )
  })

  it("should allow multiple tasks to be added", () => {
    const { stdin } = mockStdinAndStdout()
    main()
    stdin.send(`add "FIRST'_'TASK"` + EOL)
    stdin.send('add "second    task"' + EOL)
    stdin.send(' add      "  third  =  task "   ' + EOL)
    stdin.end()

    assertSaveFileExists()
    const saveFileData = readSaveFileContent()
    const taskEntries = JSON.parse(saveFileData)
    assert.strictEqual(
      taskEntries.length,
      3,
      "Save file should have three new tasks"
    )
    assert.match(
      saveFileData,
      /"id":"1","description":"FIRST'_'TASK"/,
      "Save file should have description of first task"
    )
    assert.match(
      saveFileData,
      /"id":"2","description":"second    task"/,
      "Save file should have description of first task"
    )
    assert.match(
      saveFileData,
      /"id":"3","description":"third  =  task"/,
      "Save file should have description of first task"
    )
  })

  it("should display invalid command message to user when invalid command is given", () => {
    const { stdin, stdout } = mockStdinAndStdout()
    const invalidCommand = 'add" "Buy groceries"'
    main()
    stdin.send(invalidCommand)
    stdin.end()
    stdout.stop()
    assert.match(
      stdout.output,
      new RegExp(String.raw`Invalid Command \[${invalidCommand}\] given.`),
      "Invalid Command message should be displayed to user"
    )
    assert.match(
      stdout.output,
      /List of valid commands:/,
      "Invalid Command message list of commands should be displayed to user"
    )
  })

  it("should not allow add command with more than two double quote present", () => {
    const { stdin, stdout } = mockStdinAndStdout()
    const invalidCommand = 'add "Buy groceries" test"'
    main()
    stdin.send(invalidCommand)
    stdin.end()
    stdout.stop()
    assert.match(
      stdout.output,
      new RegExp(String.raw`Invalid Command \[${invalidCommand}\] given.`),
      "Invalid Command message should be displayed to user"
    )
  })
})
