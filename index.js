const readline = require("node:readline")
const { createSaveFile, getAllTasks } = require("./storage/file")
const { Task } = require("./model/task")
const { InvalidCommand } = require("./commands/invalidCommand")
const { AddCommand } = require("./commands/addCommand")
const { ListCommand } = require("./commands/listCommand")
const { MarkDoneCommand } = require("./commands/markDoneCommand")
const { MarkInProgressCommand } = require("./commands/markInProgressCommand")

function main(onExit) {
  printProgramName()
  createSaveFile()

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  })
  rl.on("line", (line) => {
    const command = processLine(line)
    if (command) {
      const output = command.execute()
      console.log(output)
    }
    printProgramName()
  })
  rl.on("close", async () => {
    if (onExit) {
      await onExit()
    }
  })
}

function printProgramName() {
  process.stdout.write("task-cli ")
}

function processLine(line) {
  // returns a command to execute
  const words = line.trim().split(/\s+/)
  const commandKeyword = words[0]
  switch (commandKeyword.toLowerCase()) {
    case "list":
      const listType = ListCommand.getListType(line.slice(4).trim())
      return listType == null
        ? new InvalidCommand(line)
        : new ListCommand(getAllTasks(), listType)
    case "add":
      const { isValid, description } = AddCommand.parseInput(line)
      return isValid
        ? new AddCommand(new Task(description))
        : new InvalidCommand(line)
    case "mark-done":
      try {
        return new MarkDoneCommand(
          getAllTasks(),
          Number.parseInt(words[1].trim()) - 1
        )
      } catch (error) {
        return new InvalidCommand(line)
      }
    case "mark-in-progress":
      try {
        return new MarkInProgressCommand(
          getAllTasks(),
          Number.parseInt(words[1].trim()) - 1
        )
      } catch (error) {
        return new InvalidCommand(line)
      }
    default:
      return new InvalidCommand(line)
  }
}

if (require.main === module) {
  // when a file is run directly from Node, require.main is set to its module
  main()
}

module.exports = { main }
