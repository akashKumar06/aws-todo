import http from "http";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Todo from "./todo.model.js";
import path from "path";

const app = express();
const server = http.createServer(app);

const __dirname = path.resolve();

mongoose
  .connect(`${process.env.MONGO_URL}/todoDB`)
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    return res.status(200).json({ todos });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.post("/api/todo", async (req, res) => {
  try {
    const { todo } = req.body;

    if (!todo) return res.status(400).json("Todo is required.");

    const newTodo = await Todo.create({ todo });
    return res.status(200).json({ newTodo });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.delete("/api/todo/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json("Id is required.");

    const todo = await Todo.findByIdAndDelete(id);
    return res.status(200).json({ todo });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.get("*", (req, res) => {
  return res.status(404).json({ message: "Page Not Found." });
});

server.listen(process.env.PORT, () => {
  console.log("server is running at port ", process.env.PORT);
});
