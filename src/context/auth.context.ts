import { createContext, useContext } from 'react';

export interface AuthContextState {
  authenticated: boolean;
}

export const AuthContext = createContext<AuthContextState>({} as AuthContextState);

export const useAuth = () => useContext(AuthContext);
