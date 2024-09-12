const { getSaveFileContent, writeToSaveFile } = require("../storage/file")

class AddCommand {
  constructor(task) {
    this.task = task
  }

  execute() {
    const existingContent = getSaveFileContent()
    if (existingContent == null || existingContent === "") {
      writeToSaveFile("[" + this.task.toString() + "]")
    } else {
      const tasks = JSON.parse(existingContent)
      tasks.push(this.task.toJson())
      writeToSaveFile(JSON.stringify(tasks))
    }
  }
}

module.exports = { AddCommand }
