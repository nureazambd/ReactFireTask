// src/Auth.js
import React, { useState } from 'react';
import { auth } from './firebase'; // Assuming './firebase' is configured correctly
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const submit = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, pass);
      } else {
        await createUserWithEmailAndPassword(auth, email, pass);
      }
      // Optional: Add a success message or redirect here
      alert(isLogin ? 'Logged in successfully!' : 'Account created successfully!');
    } catch (err) {
      alert(`Error: ${err.message}`); // Display a user-friendly error
    }
  };

  return (
    // Outer Container: Full screen background with gradient and centering
    <div className="
        flex flex-col items-center justify-center min-h-screen
         from-indigo-500 via-purple-600 to-pink-500
        p-4
    ">
      {/* Inner Card: White background, rounded corners, shadow, responsive width */}
      <div className="
          bg-white p-8 md:p-12 rounded-3xl shadow-2xl
          w-full max-w-md
          flex flex-col items-center space-y-6
          transform transition-all duration-300 hover:scale-105
      ">
        {/* Heading: Dynamic text based on isLogin state */}
        <h2 className="
            text-4xl font-extrabold text-gray-800 mb-6
            tracking-tight leading-tight
        ">
          {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
        </h2>

        {/* Email Input */}
        <input
          type="email" // Changed type to email for better mobile experience
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email address"
          className="
            w-full p-4 border border-gray-300 rounded-xl
            focus:ring-4 focus:ring-purple-300 focus:border-purple-500 outline-none
            transition-all duration-200 text-lg
            placeholder-gray-500
          "
        />

        {/* Password Input */}
        <input
          type="password"
          value={pass}
          onChange={e => setPass(e.target.value)}
          placeholder="Password"
          className="
            w-full p-4 border border-gray-300 rounded-xl
            focus:ring-4 focus:ring-purple-300 focus:border-purple-500 outline-none
            transition-all duration-200 text-lg
            placeholder-gray-500
          "
        />

        {/* Primary Action Button (Login/Sign Up) */}
        <button
          onClick={submit}
          className="
            w-full py-4 px-6 rounded-xl
            bg-gradient-to-r from-blue-500 to-purple-600
            text-white text-xl font-bold
            shadow-lg hover:shadow-xl
            transform transition-all duration-300 hover:scale-105
            focus:outline-none focus:ring-4 focus:ring-blue-300
          "
        >
          {isLogin ? 'Login Securely' : 'Sign Up Now'}
        </button>

        {/* Toggle Button (Need an account? / Already have one?) */}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="
            mt-4 text-purple-600 hover:text-indigo-800
            font-medium text-lg
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-purple-200 rounded-md p-2
          "
        >
          {isLogin ? 'Need an account? Register Here!' : 'Already have an account? Login Here!'}
        </button>
      </div>
    </div>
  );
}