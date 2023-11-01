import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { PAGE_ROUTE } from 'constant';
import { useAuth } from 'context';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { authenticated } = useAuth();

  return authenticated ? (
    <>
      {children}
    </>
  ) : (
    <Navigate to={PAGE_ROUTE.NOT_FOUND} />
  );
};

export default PrivateRoute;
