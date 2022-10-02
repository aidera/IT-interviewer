import { render } from '@testing-library/react';
import { observable } from 'mobx';
import { Provider } from 'mobx-react';

import CategoriesList from './CategoriesList';
import { categoriesMock } from '../../mocks/categories.mock';

describe('CategoriesList', () => {
  test('should describe a list of categories', async () => {
    const categoriesStore = observable({
      categories: categoriesMock,
      filteredCategories: categoriesMock,
      isFetching: false,
      isUpdating: false,
    });

    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesList />
      </Provider>,
    );

    const categories = view.getAllByRole('listitem');

    expect(categories).toHaveLength(categoriesMock.length);
    expect(categories[0].textContent).toContain('Category title 1');
  });

  test('category should have two buttons - edit and remove', async () => {
    const categoriesStore = observable({
      categories: categoriesMock,
      filteredCategories: categoriesMock,
      isFetching: false,
      isUpdating: false,
    });

    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesList />
      </Provider>,
    );

    const editButtons = view.queryAllByLabelText('edit');
    const removeButtons = view.queryAllByLabelText('delete');

    expect(editButtons).toHaveLength(categoriesMock.length);
    expect(removeButtons).toHaveLength(categoriesMock.length);
  });
});

// by clicking on edit - the new modal should appear
// by clicking on delete - should run store remove function
// should affect on store changes
// should display loading
