import React, { ReactNode } from 'react';
import { Box, Grid, useTheme } from '@mui/material';
import Header from '../header';
import { useNavigate } from 'react-router-dom';
import { Button } from '../index';

interface Props {
  pageTitle: string;
  children: ReactNode;
}

const HeaderPageContainer = ({ pageTitle, children }: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: theme.background.default
      }}
    >
      <Box sx={{ display: 'flex', background: theme.background.header }}>
        <Button
          color="primary"
          onClick={() => navigate('/')}
          style={{ marginTop: 10, width: 200, color: 'white' }}
        >
          Home
        </Button>
      </Box>

      <Header title={pageTitle}/>
      <Grid
        container
        justifyContent="center"
        style={{
          padding: '40px 10px',
          flex: 1
        }}
      >
        <Grid item md={12} lg={8}>
          <Grid container justifyContent="center">
            {children}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default HeaderPageContainer;
