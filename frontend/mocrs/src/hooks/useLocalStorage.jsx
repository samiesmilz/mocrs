// useLocalStorage.js
import { useState, useEffect } from "react";

/**
 * A custom hook to manage state synchronized with local storage.
 *
 * @param {string} key - The key under which the value is stored in local storage.
 * @param {*} initialValue - The initial value to use if the key is not found in local storage.
 * @returns {[*, Function]} - Returns the stored value and a function to update it.
 */
export const useLocalStorage = (key, initialValue) => {
  // State to store the value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Retrieve the item from local storage
      const item = localStorage.getItem(key);
      // Parse and return the stored json or, if null, return the initial value
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from local storage", error);
      return initialValue;
    }
  });

  /**
   * Sets the value in both state and local storage.
   * @param {*} value - The value to store.
   */
  const setValue = (value) => {
    try {
      // Determine the value to store (supporting function as a parameter)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error setting local storage", error);
    }
  };

  useEffect(() => {
    // Handle changes to local storage across tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === key) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };
    // Add the event listener
    window.addEventListener("storage", handleStorageChange);
    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
};
