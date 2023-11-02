import React from 'react';
import { ThemeProvider } from '@mui/material';
import { ContextWrapper } from 'context';
import AppRouter from 'routes/AppRouter';
import { theme } from 'config';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ContextWrapper>
        <AppRouter />
      </ContextWrapper>
    </ThemeProvider>
  );
}

export default App;
