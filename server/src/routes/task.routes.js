const express = require("express")
const router = express.Router()
const TaskController = require("../controllers/task.controller")
const auth = require("../middlewares/auth.middlewares")

router.get("/get-all", auth, TaskController.getAll)
router.post("/create-one", auth, TaskController.create)
router.put("/update-one/:id", auth, TaskController.update)
router.delete("/delete-one/:id", auth, TaskController.remove)

module.exports = router