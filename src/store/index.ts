import { injectStores } from '@mobx-devtools/tools';

import CategoriesStore from './categories.store';

const categoriesStore = new CategoriesStore();

injectStores({
  categoriesStore,
});

export { categoriesStore };
