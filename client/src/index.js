import React from 'react'; // Importing React library
import ReactDOM from 'react-dom/client'; // Importing ReactDOM client for rendering
import App from './App'; // Importing the main App component
import { ThemeProvider } from './context/ThemeContext'; // Importing Theme context provider
import './index.css'; // Importing global styles

// Creating a root React DOM node for the application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering the application
root.render(
  // React.StrictMode helps catch potential problems in the application
  <React.StrictMode>
    {/* ThemeProvider wraps the App to provide theme context to all components */}
    <ThemeProvider>
      {/* Main App component - the entry point of the application */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
