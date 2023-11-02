import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PAGE_ROUTE, PageRoute } from 'constant';
import { HomePage, JobListPage, NotFoundPage, ErrorPage } from 'pages';
import PrivateRoute from './PrivateRoute';

const pageRoutes: PageRoute[] = [
  {
    path: PAGE_ROUTE.HOME,
    element: <HomePage />,
    errorElement: <ErrorPage />
  },
  {
    path: '*',
    element: <NotFoundPage />,
    errorElement: <ErrorPage />
  },
  {
    path: PAGE_ROUTE.JOBS,
    isPrivate: true,
    element: <JobListPage />,
    errorElement: <ErrorPage />
  }
];

const renderPageRoute = ({ isPrivate, element, path, ...rest }: PageRoute) => (
  <Route
    key={path}
    path={path}
    element={isPrivate ? (
      <PrivateRoute>
        {element}
      </PrivateRoute>
    ) : (
      element
    )}
    {...rest}
  />
);

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {pageRoutes.map(renderPageRoute)}
      </Routes>
    </Router>
  );
};

export default AppRouter;
