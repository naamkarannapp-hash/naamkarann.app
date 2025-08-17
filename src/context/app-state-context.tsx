"use client";

import React, { createContext, useContext, useState } from 'react';
import type { NameFormValues, NameResult } from '@/lib/types';

interface AppState {
  formValues: Partial<NameFormValues>;
  nameResults: NameResult[];
  savedNames: NameResult[];
  isLoading: boolean;
  error: string | null;
}

const defaultState: AppState = {
  formValues: {
    gender: "Neutral",
    regionalRoots: [],
    startingLetters: "",
    parent1Name: "",
    parent2Name: "",
    siblingName: "",
    inspirations: [],
    blendParents: false,
    matchSibling: false,
  },
  nameResults: [],
  savedNames: [],
  isLoading: false,
  error: null,
};

type AppStateContextType = {
  state: AppState;
  setState: React.Dispatch<Partial<AppState>>;
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(defaultState);

  const setPartialState = (newState: Partial<AppState>) => {
    setState(prevState => ({ 
      ...prevState, 
      ...newState,
      formValues: {
        ...prevState.formValues,
        ...newState.formValues,
      }
    }));
  };
  
  return (
    <AppStateContext.Provider value={{ state, setState: setPartialState as any }}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
