import { Button, FullPageContainer } from 'components';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <FullPageContainer
      content="Chào"
      subContent="by kptankhoa"
    >
      <Button
        variant="outlined"
        color="primary"
        onClick={() => navigate('record')}
        style={{ marginTop: 10, width: 200 }}
      >
        Record
      </Button>
    </FullPageContainer>
  );
};

export default Home;
