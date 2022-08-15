import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Glossary from './pages/Glossary/Glossary';
import NotFound from './pages/NotFound/NotFound';
import Quiz from './pages/Quiz/Quiz';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/'>
        <Route index element={<Navigate to='/questions' replace />} />
        <Route path='/questions' element={<Glossary />} />
        <Route path='/quiz' element={<Quiz />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
