import { model, Schema } from "mongoose";

const todosSchema = new Schema({
  task: {
    type: String,
    required: true,
    min: 6
  },
  subTasks: [{
      subTask: {
        type: String,
      },
      completed : {
        type : Boolean,
        default : false
      }
    }],
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  }
});

export const Todos = model("Todos", todosSchema);
