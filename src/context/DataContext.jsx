import { createContext, useContext, useState, useEffect } from 'react';
import { entryService } from '../services/entryService';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const { user } = useAuth();

  // Load entries on mount or when user changes
  useEffect(() => {
    const loadEntries = async () => {
      if (!user) {
        setEntries([]);
        return;
      }
      try {
        setLoading(true);
        const data = await entryService.getAll();
        setEntries(data);
      } catch (err) {
        console.error("Failed to load entries", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadEntries();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addEntry = async (entry) => {
    try {
      const newEntry = await entryService.create(entry);
      setEntries(prev => [...prev, newEntry]);
      return newEntry;
    } catch (err) {
      console.error("Failed to add entry", err);
      throw err;
    }
  };

  const updateEntry = async (id, updatedData) => {
    try {
      const updated = await entryService.update(id, updatedData);
      setEntries(prev => prev.map(item => item.id === id ? updated : item));
      return updated;
    } catch (err) {
      console.error("Failed to update entry", err);
      throw err;
    }
  };

  const deleteEntry = async (id) => {
    try {
      await entryService.delete(id);
      setEntries(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete entry", err);
      throw err;
    }
  };

  return (
    <DataContext.Provider value={{
      entries,
      addEntry,
      updateEntry,
      deleteEntry,
      theme,
      toggleTheme,
      loading,
      error
    }}>
      {children}
    </DataContext.Provider>
  );
};
