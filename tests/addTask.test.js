const { describe, it, beforeEach, after } = require("node:test")
const assert = require("node:assert")
const fs = require("node:fs")
const { main } = require("../index.js")
const { SAVE_FILE_PATH } = require("../storage/file.js")

const stdin = require("mock-stdin").stdin()

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

  it("should add one task to JSON save file", () => {
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
      /Buy groceries/,
      "Save file should have description of task"
    )
  })
})
