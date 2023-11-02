import { Button, FullPageContainer } from 'components';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGE_ROUTE } from 'constant';

const Home = () => {
  const navigate = useNavigate();

  return (
    <FullPageContainer
      content="Job Management"
    >
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate(PAGE_ROUTE.JOBS)}
      >
        Job List
      </Button>
    </FullPageContainer>
  );
};

export default Home;
