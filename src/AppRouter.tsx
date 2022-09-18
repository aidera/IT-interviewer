import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import CategoriesPage from './pages/CategoriesPage/CategoriesPage';
import QuestionsPage from './pages/QuestionsPage/QuestionsPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import QuizPage from './pages/QuizPage/QuizPage';
import AnalyticsPage from './pages/AnalyticsPage/AnalyticsPage';

const AppRouter = () => {
  return (
    <Routes>
      <Route path='/'>
        <Route index element={<Navigate to='/questions' replace />} />
        <Route path='/questions' element={<QuestionsPage />} />
        <Route path='/categories' element={<CategoriesPage />} />
        <Route path='/quiz' element={<QuizPage />} />
        <Route path='/analytics' element={<AnalyticsPage />} />
      </Route>
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;
