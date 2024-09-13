import { describe, it, beforeEach, afterEach, expect } from "vitest"
const fs = require("node:fs")
const { EOL } = require("node:os")
const { main } = require("../index.js")
const { SAVE_FILE_PATH } = require("../storage/file.js")

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const WAIT_TIME_FOR_IO_IN_MS = 500

describe("list command", () => {
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
    stdout.print = true
    stdout.start()
    return { stdin, stdout }
  }

  it("should list zero tasks when zero tasks are present", async () => {
    const { stdin, stdout } = mockStdinAndStdout()
    async function onExit() {
      await sleep(WAIT_TIME_FOR_IO_IN_MS)
      const saveFileData = readSaveFileContent()
      expect(saveFileData).toBe("", "Should have no saved tasks")
      await expect(stdout.output).not.toMatch(
        /Invalid Command \[list\] given/,
        "Should not have invalid command message"
      )
      await expect(stdout.output).toMatch(/No Tasks Available/)
    }
    main(onExit)
    stdin.send(`list` + EOL)
    stdin.end()
    stdout.stop()
  })

  it("should reject list command with invalid status keyword", async () => {
    const invalidListCommand = `list special`
    const { stdin, stdout } = mockStdinAndStdout()
    async function onExit() {
      await sleep(WAIT_TIME_FOR_IO_IN_MS)
      await expect(stdout.output).toMatch(
        new RegExp(
          String.raw`Invalid Command \[${invalidListCommand}\] given.`
        ),
        "Invalid Command message should be displayed to user"
      )
    }
    main(onExit)
    stdin.send(invalidListCommand + EOL)
    stdin.end()
    stdout.stop()
  })

  it("should list two tasks after adding two tasks", async () => {
    const { stdin, stdout } = mockStdinAndStdout()
    async function onExit() {
      await sleep(WAIT_TIME_FOR_IO_IN_MS)
      await expect(stdout.output).toMatch(
        /1\) first task \[todo\]/,
        "Should list first task"
      )
      await expect(stdout.output).toMatch(
        /2\) second task \[todo\]/,
        "Should list second task"
      )
    }
    main(onExit)
    stdin.send(`add "first task"` + EOL)
    stdin.send(`add "second task"` + EOL)
    stdin.send(`list ` + EOL)
    stdin.end()
    stdout.stop()
  })
})
