import { useState, useEffect } from 'react';

export const useSessionPersistence = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading ${key} from sessionStorage:`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to sessionStorage:`, error);
    }
  }, [key, value]);

  return [value, setValue];
};