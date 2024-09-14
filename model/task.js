const { getTotalTaskCount } = require("../storage/file")

const TaskStatus = Object.freeze({
  TODO: Symbol("todo"),
  IN_PROGRESS: Symbol("in-progress"),
  DONE: Symbol("done"),
})

class Task {
  constructor(
    description,
    status = TaskStatus.TODO.description,
    createdAt = new Date().toString(),
    updatedAt = null
  ) {
    // generate id by getting save file task count and increment (what about int overflow?)
    const count = Number.parseInt(getTotalTaskCount())
    this.id = `${count + 1}`
    this.description = description
    this.status = status
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static convertFromJson(json) {
    const task = new Task(
      json.description,
      json.status,
      json.createdAt,
      json.updatedAt === "null" ? null : json.updatedAt
    )
    task.id = json.id
    return task
  }

  toPrint() {
    return `${this.id}) ${this.description} [${this.status}]`
  }

  toString() {
    return JSON.stringify(this.toJson())
  }

  toJson() {
    return {
      id: this.id,
      description: this.description,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}

module.exports = { Task, TaskStatus }
