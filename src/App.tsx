import React from 'react';
import { ContextWrapper } from 'context';
import AppRouter from 'routes/AppRouter';

function App() {
  return (
    <ContextWrapper>
      <AppRouter />
    </ContextWrapper>
  );
}

export default App;
