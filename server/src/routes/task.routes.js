const express = require("express")
const router = express.Router()
const TaskController = require("../controllers/task.controller")

router.get("/get-all", TaskController.getAll)
router.post("/create-one", TaskController.create)
router.put("/update-one/:id", TaskController.update)
router.delete("/delete-one/:id", TaskController.remove)

module.exports = router