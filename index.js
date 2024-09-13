const readline = require("node:readline")
const { createSaveFile } = require("./storage/file")
const { Task } = require("./model/task")
const { InvalidCommand } = require("./commands/invalidCommand")
const { AddCommand } = require("./commands/addCommand")

function main(input = process.stdin, output = process.stdout) {
  printProgramName()
  createSaveFile()

  const rl = readline.createInterface({
    input,
    output,
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
}

function printProgramName() {
  process.stdout.write("task-cli ")
}

function processLine(line) {
  // returns a command to execute
  const commandKeyword = line.trim().split(/\s+/)[0]
  switch (commandKeyword.toLowerCase()) {
    case "add":
      const { isValid, description } = AddCommand.parseInput(line)
      return isValid
        ? new AddCommand(new Task(description))
        : new InvalidCommand(line)
    default:
      return new InvalidCommand(line)
  }
}

if (require.main === module) {
  // when a file is run directly from Node, require.main is set to its module
  main()
}

module.exports = { main }
