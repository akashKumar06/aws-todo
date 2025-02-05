import { useEffect, useState } from "react";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:8000" : "/";

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null);
  const [quote, setQuote] = useState(
    "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort."
  );
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const addTodo = async () => {
    if (input.trim() === "") {
      setError("Input field cannot be empty.");
      return;
    }

    const newTodo = {
      todo: input,
    };

    try {
      setIsAdding(true);
      const res = await fetch(`${BASE_URL}/api/todo`, {
        method: "POST",
        body: JSON.stringify(newTodo),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setTodos((prev) => [...prev, data.newTodo]);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsAdding(false);
      setInput("");
    }
  };

  const removeTodo = async (id) => {
    try {
      setIsDeleting(true);
      const res = await fetch(`${BASE_URL}/api/todo/${id}`, {
        method: "DELETE",
      });
      await res.json();
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // fetching todos
  useEffect(() => {
    async function fetchTodos() {
      try {
        const res = await fetch(`${BASE_URL}/api/todos`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json(); // {todos: []}
        return data.todos;
      } catch (error) {
        console.log(error);
      }
    }

    fetchTodos()
      .then((data) => {
        setTodos(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // fetching quotes
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const api = await fetch("https://dummyjson.com/quotes/random", {
        method: "GET",
      });
      const data = await api.json();
      const { quote } = data;
      setQuote(() => quote);
    }, 5 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`p-6 shadow-lg ${darkMode ? "bg-gray-800" : "bg-blue-600"}`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">My ToDo App</h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-400"
                : "bg-yellow-400 text-gray-900"
            }`}
          >
            {darkMode ? "🌙" : "☀️"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="max-w-md mx-auto">
          {/* Visual Writing */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Stay Organized</h2>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {quote}
            </p>
          </div>

          {/* Todo Input */}
          <div className="flex mb-6">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`flex-1 p-3 border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300"
              } rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Add a new task"
            />
            <button
              disabled={isAdding}
              onClick={addTodo}
              className={`p-3 ${
                darkMode
                  ? "bg-blue-700 hover:bg-blue-800"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              Add
            </button>
          </div>

          <div>{error && <p>{error?.message}</p>}</div>
          {/* Todo List */}
          <ul>
            {isLoading ? (
              <p>Fetching todos....</p>
            ) : todos.length === 0 ? (
              <p>No todos found.</p>
            ) : (
              todos.map((todo) => (
                <li
                  key={todo._id}
                  className={`${
                    isDeleting ? "bg-gray-300" : ""
                  }flex justify-between items-center p-3 mb-2 rounded-lg ${
                    darkMode
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-50"
                  } shadow-sm transition-colors duration-200`}
                >
                  <span>{todo.todo}</span>
                  <button
                    onClick={() => removeTodo(todo._id)}
                    className={`p-1 ${
                      darkMode
                        ? "text-red-400 hover:text-red-300"
                        : "text-red-500 hover:text-red-600"
                    } focus:outline-none`}
                  >
                    🗑️
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
