import React from 'react';
import AppRouter from './AppRouter';
import MainLayout from './pages/MainLayout/MainLayout';

const App = () => {
  return (
    <MainLayout>
      <AppRouter />
    </MainLayout>
  );
};

export default App;
