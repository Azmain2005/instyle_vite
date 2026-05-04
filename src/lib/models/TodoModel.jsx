import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
        required:true
    },
    category:{
        type: String,
        required:true
    },
    date:{
        type: Date,
        default:Date.now()
    }
})


const TodoModel = mongoose.models.todo || mongoose.model('todo',Schema)

export default TodoModel;