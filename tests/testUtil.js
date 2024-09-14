const fs = require("node:fs")
const { SAVE_FILE_PATH } = require("../storage/file")

function deleteSaveFile() {
  if (fs.existsSync(SAVE_FILE_PATH)) {
    fs.unlinkSync(SAVE_FILE_PATH)
  }
}

function readSaveFileContent() {
  return fs.readFileSync(SAVE_FILE_PATH, "utf8")
}

module.exports = {
  deleteSaveFile,
  readSaveFileContent,
}
