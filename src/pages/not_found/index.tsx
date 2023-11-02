import React from 'react';
import { Button, FullPageContainer } from 'components';
import { useNavigate } from 'react-router-dom';
import { PAGE_ROUTE } from '../../constant';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <FullPageContainer
      content="404"
      subContent="Page not found"
    >
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate(PAGE_ROUTE.HOME)}
        style={{ marginTop: 10, width: 200 }}
      >
        Home
      </Button>
    </FullPageContainer>
  );
};

export default NotFound;
