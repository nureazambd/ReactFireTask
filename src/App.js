import React, { useEffect, useState } from 'react';
import Auth from './Auth';
import TodoApp from './TodoApp';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Track authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <h1>📝 Serverless React Todo App</h1>

      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={() => signOut(auth)}>Logout</button>
          <TodoApp />
        </>
      ) : (
        <Auth />
      )}
    </div>
  );
}

export default App;
