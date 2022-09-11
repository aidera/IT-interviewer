import React, { ElementRef, useEffect, useRef } from 'react';

import { categoriesStore, questionsStore } from './store';
import AppRouter from './AppRouter';
import SetDefaultDataModal from './components/SetDefaultDataModal/SetDefaultDataModal';
import MainLayout from './pages/MainLayout/MainLayout';

const App = () => {
  const defaultsModalRef = useRef<ElementRef<typeof SetDefaultDataModal>>(null);

  const setDefaults = () => {
    const beenAskedAboutDefaults =
      localStorage.getItem('beenAskedAboutDefaults') === 'true';
    if (!beenAskedAboutDefaults) {
      defaultsModalRef?.current?.openModal();
    }
  };

  useEffect(() => {
    setDefaults();
    questionsStore.getQuestions();
    categoriesStore.getCategories();
  }, []);

  return (
    <MainLayout>
      <AppRouter />
      <SetDefaultDataModal ref={defaultsModalRef} />
    </MainLayout>
  );
};

export default App;
