import mongoose from "mongoose";
const todoSchema = new mongoose.Schema(
  {
    todo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
