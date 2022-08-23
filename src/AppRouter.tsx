import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import CategoriesPage from './pages/CategoriesPage/CategoriesPage';
import GlossaryPage from './pages/GlossaryPage/GlossaryPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import QuizPage from './pages/QuizPage/QuizPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/'>
        <Route index element={<Navigate to='/questions' replace />} />
        <Route path='/questions' element={<GlossaryPage />} />
        <Route path='/categories' element={<CategoriesPage />} />
        <Route path='/quiz' element={<QuizPage />} />
      </Route>
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
