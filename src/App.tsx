import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { STORAGE_KEYS } from './config';

const todoSchema = z.object({
  task: z.string().min(1, 'Task is required').max(50, 'Task must be less than 50 characters'),
});

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type TodoForm = z.infer<typeof todoSchema>;

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<TodoForm>({
    resolver: zodResolver(todoSchema),
  });
  useEffect(( )=> {
    const storedTodos=JSON.parse(sessionStorage.getItem(STORAGE_KEYS.SESSION_STORAGE.TODOS)||"[]") as Todo[]
    setTodos(storedTodos)
  },[])
 
  // Function to add new task
  const onSubmit = (data: TodoForm) => {
    const newTodo: Todo = {
      id: Date.now(),
      text: data.task,
      completed: false,
    };
    sessionStorage.setItem(STORAGE_KEYS.SESSION_STORAGE.TODOS,JSON.stringify([...todos, newTodo ]))
    setTodos([...todos, newTodo ]);
    reset(); // Clear the form after submission
  };

  // Toggle a task completion
  const toggleTodo = (id: number) => {
    const td=todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    sessionStorage.setItem(STORAGE_KEYS.SESSION_STORAGE.TODOS,JSON.stringify(td))
    setTodos(td);
  };

  // Delete a task
  const deleteTodo = (id: number) => {
    const td=todos.filter(todo => todo.id !== id)
    sessionStorage.setItem(STORAGE_KEYS.SESSION_STORAGE.TODOS,JSON.stringify(td))
    setTodos(td);
  };

  return (
    <div className="bg-slate-950 m-8 rounded-lg w-1/2 justify-items-center">
      <div className=" p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-5xl mb-4 text-yellow-500 font-bold text-center">To-Do List</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
          <input
            type="text"
            {...register('task')}
            placeholder="Enter a new task..."
            className={`border text-white w-full p-2 rounded-md ${errors.task ? 'border-red-500' : 'border-green-400'}`}
          />
          {errors.task && (
            <p className="text-red-500 text-sm mt-1">{errors.task.message}</p>
          )}
          <button
            type="submit"
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md w-36 hover:text-green-700"
          >
            Add Task
          </button>
        </form>
      
        <ul>
          {todos.map((todo) => (
            <li
              key={todo.id}
              className={`flex justify-between items-center mb-2 p-2 bg-slate-700 text-white rounded-md ${todo.completed ? 'bg-green-100' : 'bg-gray-100'}`}
            >
              <span
                onClick={() => toggleTodo(todo.id)}
                className={`cursor-pointer ${todo.completed ? 'line-through text-green-500' : ''}`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-white py-2 px-4 hover:text-red-700 rounded-md bg-red-500 "
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
