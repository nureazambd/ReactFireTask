// src/TodoApp.js
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, u => {
      setUser(u);
      if (u) fetchTodos(u.uid);
    });
  }, []);

  const fetchTodos = async (uid) => {
    const q = query(collection(db, 'todos'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    setTodos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addTodo = async () => {
    if (!user || !text.trim()) return;
    await addDoc(collection(db, 'todos'), { text, uid: user.uid });
    setText('');
    fetchTodos(user.uid);
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id));
    fetchTodos(user.uid);
  };

  return (
    <div>
      <h2>Todos</h2>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            {t.text} <button onClick={() => deleteTodo(t.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
