import { injectStores } from '@mobx-devtools/tools';

import CategoriesStore from './categories.store';
import QuestionsStore from './questions.store';
import QuizStore from './quiz.store';
import LearnLogsStore from './learn-logs.store';

const categoriesStore = new CategoriesStore();
const questionsStore = new QuestionsStore();
const quizStore = new QuizStore();
const learnLogsStore = new LearnLogsStore();

injectStores({
  categoriesStore,
  questionsStore,
  quizStore,
  learnLogsStore,
});

export { categoriesStore, questionsStore, quizStore, learnLogsStore };
