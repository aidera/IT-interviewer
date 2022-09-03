import { injectStores } from '@mobx-devtools/tools';

import CategoriesStore from './categories.store';
import QuestionsStore from './questions.store';

const categoriesStore = new CategoriesStore();
const questionsStore = new QuestionsStore();

injectStores({
  categoriesStore,
  questionsStore,
});

export { categoriesStore, questionsStore };
