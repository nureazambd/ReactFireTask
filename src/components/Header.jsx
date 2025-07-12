
import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'; // Importing icons for hamburger menu

// Make sure to install @heroicons/react if you haven't: npm install @heroicons/react

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // State to manage the mobile menu visibility

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="
      bg-gradient-to-r from-blue-600 to-purple-700
      p-4 shadow-lg
      fixed w-full top-0 left-0 z-50
    ">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo/Brand Name */}
        <a href="#" className="
          text-white text-3xl font-bold tracking-wide
          hover:text-blue-200 transition-colors duration-300
        ">
          MyBrand
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8">
          <a href="#" className="
            text-white text-lg font-medium
            hover:text-blue-200 hover:underline hover:underline-offset-4
            transition-all duration-300
          ">
            Home
          </a>
          <a href="#" className="
            text-white text-lg font-medium
            hover:text-blue-200 hover:underline hover:underline-offset-4
            transition-all duration-300
          ">
            About
          </a>
          <a href="#" className="
            text-white text-lg font-medium
            hover:text-blue-200 hover:underline hover:underline-offset-4
            transition-all duration-300
          ">
            Services
          </a>
          <a href="#" className="
            text-white text-lg font-medium
            hover:text-blue-200 hover:underline hover:underline-offset-4
            transition-all duration-300
          ">
            Contact
          </a>
        </div>

        {/* Mobile Menu Button (Hamburger Icon) */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="
            text-white p-2 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-300
            transition-colors duration-200
          ">
            {isOpen ? (
              <XMarkIcon className="h-8 w-8 text-white" /> // Close icon
            ) : (
              <Bars3Icon className="h-8 w-8 text-white" /> // Hamburger icon
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Toggles based on isOpen state) */}
      {isOpen && (
        <div className="
          md:hidden bg-blue-800 bg-opacity-95
          flex flex-col items-center space-y-4 pt-4 pb-6
          transition-all duration-300 ease-in-out
          transform origin-top
          animate-slide-down
        ">
          <a href="#" className="
            text-white text-xl font-medium w-full text-center py-2
            hover:bg-blue-700 rounded-lg transition-colors duration-200
          " onClick={toggleMenu}>
            Home
          </a>
          <a href="#" className="
            text-white text-xl font-medium w-full text-center py-2
            hover:bg-blue-700 rounded-lg transition-colors duration-200
          " onClick={toggleMenu}>
            About
          </a>
          <a href="#" className="
            text-white text-xl font-medium w-full text-center py-2
            hover:bg-blue-700 rounded-lg transition-colors duration-200
          " onClick={toggleMenu}>
            Services
          </a>
          <a href="#" className="
            text-white text-xl font-medium w-full text-center py-2
            hover:bg-blue-700 rounded-lg transition-colors duration-200
          " onClick={toggleMenu}>
            Contact
          </a>
        </div>
      )}
    </nav>
  );
}

// To use this Navbar component, you would import it into your App.js:
// import Navbar from './Navbar'; // Assuming Navbar.js is in the same directory

// Then render it in your App component:
// function App() {
//   return (
//     <div>
//       <Navbar />
//       {/* Other content of your app */}
//       <div className="pt-20"> {/* Add padding-top to avoid content being hidden under fixed navbar */}
//         <Auth /> {/* Your Auth component */}
//       </div>
//     </div>
//   );
// }
