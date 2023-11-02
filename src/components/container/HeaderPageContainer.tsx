import React, { ReactNode } from 'react';
import { Grid, useTheme } from '@mui/material';
import Header from '../header';

interface Props {
  pageTitle: string;
  children: ReactNode;
}

const HeaderPageContainer = ({ pageTitle, children }: Props) => {
  const theme = useTheme();

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
