import React, { useEffect, useState } from 'react';
import Auth from './Auth';
import TodoApp from './TodoApp';
import TodoDetail from './TodoDetail'; // Import the new TodoDetail component
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from './components/Header'; // Assuming Navbar component is in Header.jsx

function App() {
  const [user, setUser] = useState(null);
  const [selectedTodoId, setSelectedTodoId] = useState(null); // New state for selected todo

  useEffect(() => {
    // Track authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('App.js - Auth state changed. User:', user);
      setUser(user);
      // If user logs out, clear selected todo to go back to Auth or TodoApp list
      if (!user) {
        setSelectedTodoId(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Function to handle clicking a todo item in TodoApp
  const handleSelectTodo = (todoId) => {
    setSelectedTodoId(todoId);
  };

  // Function to go back to the todo list from TodoDetail
  const handleBackToList = () => {
    setSelectedTodoId(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar always renders, passing the user state */}
      <Navbar user={user} />

      {/* Conditional rendering based on user authentication */}
      {user ? (
        <>
          {/* Add padding-top to ensure content is not hidden behind the fixed navbar */}
          <div className="pt-20"> {/* Adjust pt-20 if your Navbar height is different */}
            {selectedTodoId ? ( // If a todo is selected, show TodoDetail
              <TodoDetail todoId={selectedTodoId} onBack={handleBackToList} />
            ) : ( // Otherwise, show TodoApp (the list)
              // Pass the click handler to TodoApp
              <TodoApp onTodoClick={handleSelectTodo} />
            )}
          </div>
        </>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
