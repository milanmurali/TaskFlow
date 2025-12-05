import task from "../models/taskschema.js";

const add = async (req, res) => {
    try {
        let newtask = new task(req.body)
        let response = await newtask.save()
        res.status(201).json(response)
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}


const view = async (req, res) => {
    try {
        let response = await task.find()
        res.status(200).json(response)
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}


const update = async (req, res) => {
    let id = req.params.id
    try {
        let response = await task.findByIdAndUpdate(id, req.body)
        if (!response) {
            return res.status(404).json({ message: "Task not found" })
        }
        res.status(200).json(response)
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}
const deletee = async (req, res) => {
    let id = req.params.id
    try {
        let response = await task.findByIdAndDelete(id)
        if (!response) {
            return res.status(404).json({ message: "Task not found" })
        }
        res.status(200).json(response)
    }
    catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}
export { add, view, update, deletee }