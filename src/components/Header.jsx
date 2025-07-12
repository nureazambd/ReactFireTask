import React, { useState, useEffect } from 'react'; // Added useEffect for logging
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // Assuming '../firebase' is the correct path to your firebase config

export default function Navbar({ user }) { // Accept user as a prop
    const [isOpen, setIsOpen] = useState(false);

    // Log the user prop whenever it changes in Navbar
    useEffect(() => {
        console.log('Navbar.jsx - User prop received:', user);
        // You can also log specific properties of the user object if it exists
        if (user) {
            console.log('Navbar.jsx - User email:', user.email);
            console.log('Navbar.jsx - User UID:', user.uid);
        }
    }, [user]); // Re-run this effect whenever the 'user' prop changes

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            setIsOpen(false); // Close mobile menu after logout
            alert("Logged out successfully!");
        } catch (error) {
            console.error("Error signing out:", error);
            alert("Failed to log out. Please try again.");
        }
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
                    ReactFireTask
                </a>

                {/* Desktop Navigation Links and User Info/Logout */}
                <div className="hidden md:flex space-x-8 items-center">
                    {/* <a href="#" className="
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
          </a> */}

                    {/* Conditional rendering for user info and logout button */}
                    {user ? ( // Check if user object exists and is truthy
                        <div className="flex items-center space-x-4 ml-8">
                            <span className="text-white text-md font-light break-all">
                                Welcome, {user.email || 'User'} {/* Display email if available, else 'User' */}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="
                  py-2 px-4 rounded-full
                  bg-red-500 text-white text-md font-semibold
                  hover:bg-red-600 transition-colors duration-300
                  focus:outline-none focus:ring-2 focus:ring-red-300
                "
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        // Optional: You can render something here if no user is logged in, e.g., a Login/Signup link
                        // <span className="text-white text-md">Not Logged In</span>
                        null // Render nothing if no user
                    )}
                </div>

                {/* Mobile Menu Button (Hamburger Icon) */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="
            text-white p-2 rounded-md
            focus:outline-none focus:ring-2 focus:ring-blue-300
            transition-colors duration-200
          ">
                        {isOpen ? (
                            <XMarkIcon className="h-8 w-8 text-white" />
                        ) : (
                            <Bars3Icon className="h-8 w-8 text-white" />
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

                    {/* Conditional rendering for logout in mobile menu */}
                    {user ? ( // Check if user object exists and is truthy
                        <>
                            <span className="text-white text-md font-light w-full text-center py-2 break-all">
                                Welcome, {user.email || 'User'}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="
                  w-full py-3 px-6 rounded-lg
                  bg-red-500 text-white text-xl font-bold
                  hover:bg-red-600 transition-colors duration-300
                  focus:outline-none focus:ring-2 focus:ring-red-300
                "
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        // Optional: Render something for non-logged-in mobile users
                        null
                    )}
                </div>
            )}
        </nav>
    );
}