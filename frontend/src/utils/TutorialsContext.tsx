import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Tutorial } from './Tutorial';
import api from '@/api';

type TutorialsContextType = {
  tutorials: Tutorial[];
  loading: boolean;
  error: unknown;
  refetch: () => void;
};

const TutorialsContext = createContext<TutorialsContextType | undefined>(undefined);

export function TutorialsProvider({ children }: { children: React.ReactNode }){
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchTutorials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      api.get('/tutorials/')
      .then((res) => {
        setTutorials(res.data)
      })
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TutorialsContext.Provider value={{ tutorials, loading, error, refetch: fetchTutorials }}>
      {children}
    </TutorialsContext.Provider>
  );
};

export const useTutorialsContext = () => {
  const context = useContext(TutorialsContext);
  if (!context) {
    throw new Error('useTutorialsContext must be used within a FetchProvider');
  }
  return context;
};