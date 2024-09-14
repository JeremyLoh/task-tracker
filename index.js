const readline = require("node:readline")
const { createSaveFile } = require("./storage/file")
const { CommandFactory } = require("./commands/commandFactory")

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
  return CommandFactory.createCommand(line)
}

if (require.main === module) {
  // when a file is run directly from Node, require.main is set to its module
  main()
}

module.exports = { main }
