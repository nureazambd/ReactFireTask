import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase'; // Assuming './firebase' is configured correctly
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot // Import onSnapshot for real-time updates
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error messages

  // Effect to handle user authentication state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // If user is logged in, set up real-time listener for todos
        const q = query(collection(db, 'todos'), where('uid', '==', u.uid));
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          setTodos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false); // Data loaded
        }, (err) => {
          console.error("Error fetching real-time todos:", err);
          setError("Failed to load todos. Please try again.");
          setLoading(false);
        });
        return () => unsubscribeSnapshot(); // Clean up snapshot listener on unmount or user change
      } else {
        setTodos([]); // Clear todos if no user
        setLoading(false);
      }
    }, (err) => {
      console.error("Auth state change error:", err);
      setError("Authentication error. Please refresh.");
      setLoading(false);
    });

    return () => unsubscribeAuth(); // Clean up auth listener on component unmount
  }, []);

  // Function to add a new todo
  const addTodo = async () => {
    if (!user) {
      setError("You must be logged in to add a todo.");
      return;
    }
    if (!text.trim()) {
      setError("Todo text cannot be empty.");
      return;
    }
    setError(null); // Clear previous errors
    try {
      await addDoc(collection(db, 'todos'), { text, uid: user.uid, createdAt: new Date() });
      setText(''); // Clear input after adding
      // The onSnapshot listener will automatically update the todos state
    } catch (err) {
      console.error("Error adding todo:", err);
      setError("Failed to add todo. Please try again.");
    }
  };

  // Function to delete a todo
  const deleteTodo = async (id) => {
    setError(null); // Clear previous errors
    try {
      await deleteDoc(doc(db, 'todos', id));
      // The onSnapshot listener will automatically update the todos state
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete todo. Please try again.");
    }
  };

  return (
    // Outer Container: Full screen background with gradient and centering
    <div className="
        flex flex-col items-center justify-center min-h-screen
        from-purple-500 via-indigo-600 to-blue-500
        p-4 sm:p-6 lg:p-8
    ">
      {/* Todo Card: White background, rounded corners, shadow, responsive width */}
      <div className="
          bg-white p-8 md:p-12 rounded-3xl shadow-lg
          w-full max-w-xl
          flex flex-col items-center space-y-6
          transform transition-all
      ">
        {/* Heading */}
        <h2 className="
            text-4xl font-extrabold text-gray-800 mb-4
            tracking-tight leading-tight text-center
        ">
          Your Todos
        </h2>

        {/* Display User ID (Important for multi-user apps with Firestore rules) */}
        {user && (
          <p className="text-gray-600 text-sm mb-4 text-center">
            Logged in as: <span className="font-semibold text-purple-700 break-all">{user.uid}</span>
          </p>
        )}

        {/* Input and Add Button Section */}
        <div className="flex w-full space-x-3 mb-6">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Add a new todo..."
            className="
              flex-grow p-4 border border-gray-300 rounded-xl
              focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none
              transition-all duration-200 text-lg
              placeholder-gray-500
            "
          />
          <button
            onClick={addTodo}
            className="
              py-3 px-6 rounded-xl
              bg-gradient-to-r from-green-500 to-teal-600
              text-white text-lg font-bold
              shadow-md hover:shadow-lg
              transform transition-all duration-300 hover:scale-105
              focus:outline-none focus:ring-4 focus:ring-green-300
            "
          >
            Add
          </button>
        </div>

        {/* Error Message Display */}
        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded-lg w-full text-center mb-4">
            {error}
          </p>
        )}

        {/* Loading Indicator */}
        {loading && (
          <p className="text-gray-500 text-lg">Loading todos...</p>
        )}

        {/* Todo List */}
        {!loading && todos.length === 0 && !error && (
          <p className="text-gray-500 text-lg">No todos yet! Add one above.</p>
        )}

        {!loading && todos.length > 0 && (
          <ul className="w-full space-y-4">
            {todos.map(t => (
              <li
                key={t.id}
                className="
                  flex justify-between items-center
                  bg-gray-50 p-4 rounded-xl shadow-sm
                  hover:bg-gray-100 transition-colors duration-200
                "
              >
                <span className="text-gray-800 text-lg font-medium flex-grow break-words pr-4">
                  {t.text}
                </span>
                <button
                  onClick={() => deleteTodo(t.id)}
                  className="
                    p-2 rounded-full bg-red-100 text-red-600
                    hover:bg-red-200 hover:text-red-800
                    focus:outline-none focus:ring-2 focus:ring-red-300
                    transition-all duration-200
                  "
                  title="Delete Todo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
