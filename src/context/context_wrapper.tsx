import React, { ReactNode } from 'react';
import { useAuthState, useJobState } from 'hooks';
import { JobContext } from './job.context';
import { AuthContext } from './auth.context';

export const ContextWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContext.Provider value={useAuthState()}>
      <JobContext.Provider value={useJobState()}>
        {children}
      </JobContext.Provider>
    </AuthContext.Provider>
  );
};
