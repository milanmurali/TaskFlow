import mongoose from "mongoose";

let taskschema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true

    },
    status: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const task = mongoose.model("task", taskschema)
export default task;