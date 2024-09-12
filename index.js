const readline = require("node:readline")
const { AddCommand } = require("./commands/addCommand")
const { createSaveFile } = require("./storage/file")
const { Task } = require("./model/task")

function main() {
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
}

function printProgramName() {
  process.stdout.write("task-cli ")
}

function processLine(line) {
  // returns a command to execute
  const commandKeyword = line.trim().split(/\s+/)[0]
  const data = line.trim().slice(commandKeyword.length)
  switch (commandKeyword.toLowerCase()) {
    case "add":
      return new AddCommand(new Task(data))
    default:
      break
  }
}

if (require.main === module) {
  // when a file is run directly from Node, require.main is set to its module
  main()
}

module.exports = { main }
