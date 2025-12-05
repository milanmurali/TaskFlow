import express from "express"
import cors from "cors"
import { connectDB } from "./dbconfig/DBconfig.js"
import taskRouter from "./routes/taskRouter.js"

const app = express()

connectDB()
app.use(express.json())
app.use(cors())


app.use('/task', taskRouter)

app.listen(7000, () => {
    console.log("Task Node Server Running on 7000");
}) 