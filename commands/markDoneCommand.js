const { TaskStatus } = require("../model/task")
const { writeToSaveFile } = require("../storage/file")

class MarkDoneCommand {
  constructor(tasks, index) {
    this.tasks = tasks
    this.index = index
  }

  execute() {
    // index is zero based
    if (this.index < 0 || this.tasks[this.index] == null) {
      return `Invalid index provided [${this.index + 1}]`
    }
    this.tasks[this.index]["status"] = TaskStatus.DONE.description
    this.tasks[this.index]["updatedAt"] = new Date().toString()
    writeToSaveFile(JSON.stringify(this.tasks))
    return `Marked Task ${this.index + 1} as done`
  }
}

module.exports = { MarkDoneCommand }
