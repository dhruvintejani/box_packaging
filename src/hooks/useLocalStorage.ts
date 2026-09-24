import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item === null) return initialValue;
      return JSON.parse(item) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // Ignore write errors
    }
  }, [key, storedValue]);

  const setValue = (value: T | ((val: T) => T)) => {
    // Use React's functional updater. Two quick actions must not overwrite each
    // other with an older value captured by the render closure.
    setStoredValue((previous) =>
      typeof value === 'function' ? (value as (val: T) => T)(previous) : value
    );
  };

  return [storedValue, setValue] as const;
}
