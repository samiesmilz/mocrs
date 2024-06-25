import { useState, useEffect } from "react";

/**
 * Custom React hook that syncs state with localStorage.
 *
 * @param {string} key - The key under which the value is stored in localStorage.
 * @param {*} defaultValue - The default value to use if there is no value in localStorage.
 * @returns {[*, Function]} - Returns the current value and a setter function to update the value.
 */
const useLocalStorage = (key, defaultValue) => {
  const [localStorageValue, setLocalStorageValue] = useState(() => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.warn(`Error parsing localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      const valueToStore = JSON.stringify(localStorageValue);
      localStorage.setItem(key, valueToStore);
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [localStorageValue, key]);

  const setLocalValue = (value) => {
    const newValue =
      value instanceof Function ? value(localStorageValue) : value;
    setLocalStorageValue(newValue);
  };

  return [localStorageValue, setLocalValue];
};

export default useLocalStorage;
