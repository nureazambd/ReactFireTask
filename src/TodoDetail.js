import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Import db
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Import Firestore functions

// Import icons for save and back (install @heroicons/react if you haven't)
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function TodoDetail({ todoId, onBack }) {
  const [todo, setTodo] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false); // State for save button loading

  // Effect to fetch todo details when todoId changes
  useEffect(() => {
    const fetchTodoDetails = async () => {
      if (!todoId) {
        setError("No todo selected.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const docRef = doc(db, 'todos', todoId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const todoData = { id: docSnap.id, ...docSnap.data() };
          setTodo(todoData);
          setNotes(todoData.notes || ''); // Set notes from fetched data or empty string
        } else {
          setError("Todo not found.");
        }
      } catch (err) {
        console.error("Error fetching todo details:", err);
        setError("Failed to load todo details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodoDetails();
  }, [todoId]); // Re-run when todoId changes

  // Function to save notes to Firestore
  const saveNotes = async () => {
    if (!todoId) {
      setError("No todo selected to save notes.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const todoRef = doc(db, 'todos', todoId);
      await updateDoc(todoRef, { notes: notes });
      alert("Notes saved successfully!"); // Simple confirmation
    } catch (err) {
      console.error("Error saving notes:", err);
      setError("Failed to save notes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-500">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-gray-700 text-xl">
          Loading todo details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-500">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-red-600 text-xl text-center">
          {error}
          <button
            onClick={onBack}
            className="mt-6 py-2 px-4 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center mx-auto"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Todos
          </button>
        </div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-500">
        <div className="bg-white p-8 rounded-3xl shadow-2xl text-gray-700 text-xl text-center">
          Todo not found or no todo selected.
          <button
            onClick={onBack}
            className="mt-6 py-2 px-4 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center mx-auto"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to Todos
          </button>
        </div>
      </div>
    );
  }

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
        {/* Back Button */}
        <button
          onClick={onBack}
          className="
            self-start py-2 px-4 rounded-xl
            bg-gray-200 text-gray-700 font-medium
            hover:bg-gray-300 transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-gray-400
            flex items-center
          "
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" /> Back to List
        </button>

        {/* Todo Title */}
        <h2 className="
            text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4
            tracking-tight leading-tight text-center
        ">
          Todo: <span className="text-purple-700">{todo.text}</span>
        </h2>

        {/* Notes Section */}
        <div className="w-full">
          <label htmlFor="notes" className="block text-gray-700 text-lg font-semibold mb-2">
            Notes:
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your notes here..."
            rows="8"
            className="
              w-full p-4 border border-gray-300 rounded-xl
              focus:ring-4 focus:ring-blue-300 focus:border-blue-500 outline-none
              transition-all duration-200 text-lg
              placeholder-gray-500 resize-y
            "
          ></textarea>
        </div>

        {/* Save Notes Button */}
        <button
          onClick={saveNotes}
          disabled={isSaving} // Disable while saving
          className="
            w-full py-4 px-6 rounded-xl
            bg-gradient-to-r from-green-500 to-teal-600
            text-white text-xl font-bold
            shadow-lg hover:shadow-xl
            transform transition-all duration-300 hover:scale-105
            focus:outline-none focus:ring-4 focus:ring-green-300
            flex items-center justify-center
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <CheckIcon className="h-6 w-6 mr-2" /> Save Notes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
