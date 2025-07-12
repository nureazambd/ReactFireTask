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
  onSnapshot,
  updateDoc
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon as CloseIcon } from '@heroicons/react/24/outline';


// Accept onTodoClick prop
export default function TodoApp({ onTodoClick }) {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editText, setEditText] = useState('');

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const q = query(collection(db, 'todos'), where('uid', '==', u.uid));
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          setTodos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        }, (err) => {
          console.error("Error fetching real-time todos:", err);
          setError("Failed to load todos. Please try again.");
          setLoading(false);
        });
        return () => unsubscribeSnapshot();
      } else {
        setTodos([]);
        setLoading(false);
      }
    }, (err) => {
      console.error("Auth state change error:", err);
      setError("Authentication error. Please refresh.");
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const addTodo = async () => {
    if (!user) {
      setError("You must be logged in to add a todo.");
      return;
    }
    if (!text.trim()) {
      setError("Todo text cannot be empty.");
      return;
    }
    setError(null);
    try {
      await addDoc(collection(db, 'todos'), { text, uid: user.uid, createdAt: new Date(), notes: '' }); // Initialize notes field
      setText('');
    } catch (err) {
      console.error("Error adding todo:", err);
      setError("Failed to add todo. Please try again.");
    }
  };

  const deleteTodo = async (id) => {
    setError(null);
    try {
      await deleteDoc(doc(db, 'todos', id));
    } catch (err) {
      console.error("Error deleting todo:", err);
      setError("Failed to delete todo. Please try again.");
    }
  };

  const startEdit = (todo) => {
    setEditingTodoId(todo.id);
    setEditText(todo.text);
    setError(null);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) {
      setError("Todo text cannot be empty.");
      return;
    }
    setError(null);
    try {
      const todoRef = doc(db, 'todos', id);
      await updateDoc(todoRef, { text: editText });
      setEditingTodoId(null);
      setEditText('');
    } catch (err) {
      console.error("Error updating todo:", err);
      setError("Failed to update todo. Please try again.");
    }
  };

  const cancelEdit = () => {
    setEditingTodoId(null);
    setEditText('');
    setError(null);
  };

  const filteredTodos = todos.filter(todo =>
    todo.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="
        flex flex-col items-center justify-center min-h-screen
        bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-500
        p-4 sm:p-6 lg:p-8
    ">
      <div className="
          bg-white p-8 md:p-12 rounded-3xl shadow-2xl
          w-full max-w-xl
          flex flex-col items-center space-y-6
          transform transition-all duration-300 hover:scale-105
      ">
        <h2 className="
            text-4xl font-extrabold text-gray-800 mb-4
            tracking-tight leading-tight text-center
        ">
          Your Todos
        </h2>

        {user && (
          <p className="text-gray-600 text-sm mb-4 text-center">
            Logged in as: <span className="font-semibold text-purple-700 break-all">{user.uid}</span>
          </p>
        )}

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

        <div className="w-full mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search todos..."
            className="
              w-full p-4 border border-gray-300 rounded-xl
              focus:ring-4 focus:ring-purple-300 focus:border-purple-500 outline-none
              transition-all duration-200 text-lg
              placeholder-gray-500
            "
          />
        </div>

        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded-lg w-full text-center mb-4">
            {error}
          </p>
        )}

        {loading && (
          <p className="text-gray-500 text-lg">Loading todos...</p>
        )}

        {!loading && filteredTodos.length === 0 && !error && searchQuery === '' && (
          <p className="text-gray-500 text-lg">No todos yet! Add one above.</p>
        )}
        {!loading && filteredTodos.length === 0 && !error && searchQuery !== '' && (
          <p className="text-gray-500 text-lg">No todos match your search.</p>
        )}

        {!loading && filteredTodos.length > 0 && (
          <ul className="w-full space-y-4">
            {filteredTodos.map(t => (
              <li
                key={t.id}
                className="
                  flex justify-between items-center
                  bg-gray-50 p-4 rounded-xl shadow-sm
                  hover:bg-gray-100 transition-colors duration-200
                  cursor-pointer /* Indicate clickable */
                "
                onClick={() => onTodoClick(t.id)} /* Call onTodoClick here */
              >
                {/* Conditional rendering: show input if editing, else show text */}
                {editingTodoId === t.id ? (
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    // Prevent click on input from bubbling to li and opening detail
                    onClick={(e) => e.stopPropagation()}
                    className="
                      flex-grow p-2 border border-gray-300 rounded-lg
                      focus:ring-2 focus:ring-purple-300 focus:border-purple-500 outline-none
                      text-lg
                    "
                  />
                ) : (
                  <span className="text-gray-800 text-lg font-medium flex-grow break-words pr-4">
                    {t.text}
                  </span>
                )}

                {/* Action Buttons: Edit/Save and Delete/Cancel */}
                <div className="flex space-x-2 ml-4" onClick={(e) => e.stopPropagation()}> {/* Prevent clicks on buttons from bubbling to li */}
                  {editingTodoId === t.id ? (
                    <>
                      {/* Save Button */}
                      <button
                        onClick={() => saveEdit(t.id)}
                        className="
                          p-2 rounded-full bg-green-100 text-green-600
                          hover:bg-green-200 hover:text-green-800
                          focus:outline-none focus:ring-2 focus:ring-green-300
                          transition-all duration-200
                        "
                        title="Save Changes"
                      >
                        <CheckIcon className="h-6 w-6" />
                      </button>
                      {/* Cancel Button */}
                      <button
                        onClick={cancelEdit}
                        className="
                          p-2 rounded-full bg-gray-100 text-gray-600
                          hover:bg-gray-200 hover:text-gray-800
                          focus:outline-none focus:ring-2 focus:ring-gray-300
                          transition-all duration-200
                        "
                        title="Cancel Edit"
                      >
                        <CloseIcon className="h-6 w-6" />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Edit Button */}
                      <button
                        onClick={() => startEdit(t)}
                        className="
                          p-2 rounded-full bg-blue-100 text-blue-600
                          hover:bg-blue-200 hover:text-blue-800
                          focus:outline-none focus:ring-2 focus:ring-blue-300
                          transition-all duration-200
                        "
                        title="Edit Todo"
                      >
                        <PencilIcon className="h-6 w-6" />
                      </button>
                      {/* Delete Button */}
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
                        <TrashIcon className="h-6 w-6" />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
