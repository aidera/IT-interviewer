import { injectStores } from '@mobx-devtools/tools';

import CategoriesStore from './categories.store';
import QuestionsStore from './questions.store';
import QuizStore from './quiz.store';

const categoriesStore = new CategoriesStore();
const questionsStore = new QuestionsStore();
const quizStore = new QuizStore();

injectStores({
  categoriesStore,
  questionsStore,
  quizStore,
});

export { categoriesStore, questionsStore, quizStore };
