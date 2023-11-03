import React from 'react';
import { Navigate } from 'react-router-dom';
import { PAGE_ROUTE } from 'constant';

const Home = () => (
  <Navigate
    to={PAGE_ROUTE.JOBS}
  />
);

export default Home;
