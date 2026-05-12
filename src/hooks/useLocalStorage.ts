import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

type UseLocalStorageOptions<T> = {
  deserialize?: (value: string) => T;
  serialize?: (value: T) => string;
};

type LocalStorageSetter<T> = Dispatch<SetStateAction<T>>;

const canUseStorage = () => typeof window !== "undefined" && "localStorage" in window;

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T),
  options: UseLocalStorageOptions<T> = {},
): [T, LocalStorageSetter<T>, () => void] {
  const { deserialize = JSON.parse as (value: string) => T, serialize = JSON.stringify } = options;

  const readInitialValue = useCallback((): T => {
    const fallbackValue = initialValue instanceof Function ? initialValue() : initialValue;

    if (!canUseStorage()) {
      return fallbackValue;
    }

    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue === null ? fallbackValue : deserialize(storedValue);
    } catch {
      return fallbackValue;
    }
  }, [deserialize, initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readInitialValue);

  const setValue: LocalStorageSetter<T> = useCallback(
    (value) => {
      setStoredValue((currentValue) => {
        const nextValue = value instanceof Function ? value(currentValue) : value;

        if (canUseStorage()) {
          try {
            window.localStorage.setItem(key, serialize(nextValue));
          } catch {
            // Keep React state responsive even when storage is unavailable or full.
          }
        }

        return nextValue;
      });
    },
    [key, serialize],
  );

  const removeValue = useCallback(() => {
    if (canUseStorage()) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // Ignore storage failures; the in-memory fallback is still cleared.
      }
    }

    setStoredValue(initialValue instanceof Function ? initialValue() : initialValue);
  }, [initialValue, key]);

  useEffect(() => {
    if (!canUseStorage()) {
      return undefined;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.storageArea !== window.localStorage || event.key !== key) {
        return;
      }

      if (event.newValue === null) {
        setStoredValue(initialValue instanceof Function ? initialValue() : initialValue);
        return;
      }

      try {
        setStoredValue(deserialize(event.newValue));
      } catch {
        setStoredValue(initialValue instanceof Function ? initialValue() : initialValue);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [deserialize, initialValue, key]);

  return [storedValue, setValue, removeValue];
}
