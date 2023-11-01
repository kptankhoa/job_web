import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { PAGE_ROUTE } from 'constant';
import { Home, JobPage, NotFound, Error } from 'pages';
import PrivateRoute from './PrivateRoute';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route
          path={PAGE_ROUTE.HOME}
          element={<Home />}
          errorElement={<Error />}
        />
        <Route
          path={PAGE_ROUTE.JOBS}
          element={(
            <PrivateRoute>
              <JobPage />
            </PrivateRoute>
          )}
          errorElement={<Error />}
        />
        <Route
          path="*"
          element={<NotFound />}
          errorElement={<Error />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
