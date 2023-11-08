import React, { ReactElement } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PAGE_ROUTE } from 'constant';
import {
  HomePage, JobListPage, NewJobPage, NotFoundPage, ErrorPage, EditJobPage
} from 'pages';
import PrivateRoute from './PrivateRoute';
import ReportRecording from '../pages/record';

const withPrivateRoute = (element: ReactElement) => (
  <PrivateRoute>
    {element}
  </PrivateRoute>
);

const router = createBrowserRouter(
  [
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
      element: withPrivateRoute(<JobListPage />),
      errorElement: <ErrorPage />
    },
    {
      path: PAGE_ROUTE.EDIT_JOB,
      element: withPrivateRoute(<EditJobPage />),
      errorElement: <ErrorPage />
    },
    {
      path: 'record',
      element: withPrivateRoute(<ReportRecording />),
      errorElement: <ErrorPage />
    },
    {
      path: PAGE_ROUTE.NEW_JOB,
      element: withPrivateRoute(<NewJobPage />),
      errorElement: <ErrorPage />
    }
  ]
);

const AppRouter = () => (
  <RouterProvider router={router} />
);

export default AppRouter;
