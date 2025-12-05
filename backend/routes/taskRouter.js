import express from "express";

import { add, deletee, update, view,} from "../controllers/taskController.js";
import task from "../models/taskschema.js";

const taskRouter = express.Router()

taskRouter.post("/add", add)
taskRouter.get("/view", view)
taskRouter.put("/update/:id", update)
taskRouter.delete("/delete/:id", deletee)


export default taskRouter