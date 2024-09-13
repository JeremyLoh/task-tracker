const { EOL } = require("os")
const { Task } = require("../model/task")

const ListTaskType = Object.freeze({
  TODO: Symbol("todo"),
  IN_PROGRESS: Symbol("in_progress"),
  DONE: Symbol("done"),
  ALL: Symbol(""),
})

class ListCommand {
  constructor(allTasks, listType) {
    this.allTasks = allTasks.map((task) => Task.convertFromJson(task))
    this.listType = listType
  }

  static getListType(type) {
    if (type === ListTaskType.ALL.description) {
      return ListTaskType.ALL
    } else if (type === ListTaskType.DONE.description) {
      return ListTaskType.DONE
    } else if (type === ListTaskType.IN_PROGRESS.description) {
      return ListTaskType.IN_PROGRESS
    } else if (type === ListTaskType.TODO.description) {
      return ListTaskType.TODO
    } else {
      return null
    }
  }

  execute() {
    if (this.allTasks.length === 0) {
      return "No Tasks Available"
    }
    if (this.listType.description === ListTaskType.ALL.description) {
      return getTaskListPrint(this.allTasks)
    }
    const tasksToDisplay = this.allTasks.filter(
      (task) => task.status === this.listType.description
    )
    return getTaskListPrint(tasksToDisplay)
  }
}

function getTaskListPrint(tasks) {
  let output = ""
  for (const task of tasks) {
    output += task.toPrint() + EOL
  }
  return output
}

module.exports = { ListCommand, ListTaskType }
