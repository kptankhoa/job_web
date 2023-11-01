import { AuthContextState } from 'context';

export const useAuthState = (): AuthContextState => {
  return {
    authenticated: true
  };
};
