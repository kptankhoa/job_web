import { RouteProps } from 'react-router-dom';

export type PageRoute = RouteProps & {
  isPrivate?: boolean;
}

export const PAGE_ROUTE = {
  HOME: '/',
  JOBS: '/jobs',
  NEW_JOB: '/jobs/new',
  EDIT_JOB: '/jobs/:id/edit',
  NOT_FOUND: '/not-found'
};
