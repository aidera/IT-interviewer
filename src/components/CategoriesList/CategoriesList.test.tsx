import { render, screen } from '@testing-library/react';
import { observable } from 'mobx';
import { Provider } from 'mobx-react';

import CategoriesList from './CategoriesList';
import { categoriesMock } from '../../mocks/categories.mock';
import userEvent from '@testing-library/user-event';

const deleteCategoryMock = jest.fn();

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

  test('by clicking on edit - the new modal should appear', async () => {
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
    userEvent.click(editButtons[0] as HTMLElement);

    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
  });

  test('by clicking on delete - should run store remove function', async () => {
    const categoriesStore = observable({
      categories: categoriesMock,
      filteredCategories: categoriesMock,
      isFetching: false,
      isUpdating: false,
      deleteCategory: deleteCategoryMock,
    });

    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesList />
      </Provider>,
    );

    const removeButtons = view.getAllByLabelText('delete-button');
    userEvent.click(removeButtons[0] as HTMLElement);

    expect(deleteCategoryMock).toHaveBeenCalled();
    expect(deleteCategoryMock).toHaveBeenCalledTimes(1);
  });

  test('should display spinner if it is fetching', async () => {
    const categoriesStore = observable({
      categories: categoriesMock,
      filteredCategories: categoriesMock,
      isFetching: true,
      isUpdating: false,
    });

    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesList />
      </Provider>,
    );

    const spinner = view.queryByLabelText('spinner');

    expect(spinner).toBeInTheDocument();
  });

  test('should not display spinner if it is not fetching', async () => {
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

    const spinner = view.queryByLabelText('spinner');

    expect(spinner).not.toBeInTheDocument();
  });

  test('while updating the buttons should be disabled', async () => {
    const categoriesStore = observable({
      categories: categoriesMock,
      filteredCategories: categoriesMock,
      isFetching: false,
      isUpdating: true,
    });

    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesList />
      </Provider>,
    );

    const editButtons = view.queryAllByLabelText('edit-button');
    const deleteButtons = view.queryAllByLabelText('delete-button');

    expect(editButtons[0]).toBeDisabled();
    expect(deleteButtons[0]).toBeDisabled();
  });

  test('while not updating the buttons should not be disabled', async () => {
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

    const editButtons = view.queryAllByLabelText('edit-button');
    const deleteButtons = view.queryAllByLabelText('delete-button');

    expect(editButtons[0]).not.toBeDisabled();
    expect(deleteButtons[0]).not.toBeDisabled();
  });
});
