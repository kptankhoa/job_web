import React, { ReactNode } from 'react';
import { useAuth } from 'context';
import { NotFoundPage } from 'pages';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { authenticated } = useAuth();

  return authenticated ? (
    <>
      {children}
    </>
  ) : (
    <NotFoundPage />
  );
};

export default PrivateRoute;
