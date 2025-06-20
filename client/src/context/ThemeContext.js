import { createContext, useEffect, useState } from 'react'; // Importing React and necessary hooks

// Create the context
export const ThemeContext = createContext(); // Creating a new context for theme management

// Theme Provider component
export const ThemeProvider = ({ children }) => {
  const storedTheme = localStorage.getItem('theme'); // Retrieving the stored theme from localStorage
  const [theme, setTheme] = useState(storedTheme || 'dark'); // Setting the initial theme state

  useEffect(() => {
    // Save selected theme to localStorage
    localStorage.setItem('theme', theme); // Storing the current theme in localStorage

    // Remove previous theme class
    document.body.classList.remove('light-theme', 'dark-theme'); // Removing existing theme classes from the body

    // Add current theme class
    document.body.classList.add(`${theme}-theme`); // Adding the current theme class to the body
  }, [theme]); // Effect runs whenever the theme changes

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light')); // Toggling the theme state
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}> {/* Providing theme and toggleTheme to context consumers */}
      {children} {/* Rendering child components */}
    </ThemeContext.Provider>
  );
};
