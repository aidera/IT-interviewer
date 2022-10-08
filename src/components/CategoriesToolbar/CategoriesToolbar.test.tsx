import { act, render, screen, waitFor } from '@testing-library/react';
import { observable } from 'mobx';
import { Provider } from 'mobx-react';
import userEvent from '@testing-library/user-event';
import { useMediaQuery } from '@react-hook/media-query';

import CategoriesToolbar from './CategoriesToolbar';
import classes from './CategoriesToolbar.module.scss';

jest.mock('@react-hook/media-query', () => ({
  ...jest.requireActual('@react-hook/media-query'),
  useMediaQuery: jest.fn().mockReturnValue(false),
}));

const categoriesStoreSetFilters = jest.fn();
const categoriesStoreClearFilters = jest.fn();

describe('CategoriesToolbar', () => {
  let categoriesStore: any;

  beforeAll(() => {
    categoriesStore = observable({
      filters: { title: '' },
      setFilters: categoriesStoreSetFilters,
      clearFilters: categoriesStoreClearFilters,
    });
  });

  test('not display "Filters" button if it\'s not a mobile view', () => {
    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesToolbar />
      </Provider>,
    );

    const filtersButton = view.queryByRole('button', {
      name: /Filters/,
    });

    expect(filtersButton).not.toBeInTheDocument();
  });

  test('display "Filters" button if it\'s a mobile view', () => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(true);

    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesToolbar />
      </Provider>,
    );

    const filtersButton = view.queryByRole('button', {
      name: /Filters/,
    });

    expect(filtersButton).toBeInTheDocument();
  });

  test('there are no visible filters at the beginning if the view is mobile', () => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(true);

    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesToolbar />
      </Provider>,
    );

    const filters = view.queryByTestId('filters');

    expect(filters).toHaveClass(classes.filtersClosed);
  });

  test('display filters by clicking on filters button if the view is mobile', () => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(true);

    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesToolbar />
      </Provider>,
    );

    const filtersButton = view.queryByRole('button', {
      name: /Filters/,
    });

    userEvent.click(filtersButton as HTMLElement);

    const filters = view.queryByTestId('filters');

    expect(filters).not.toHaveClass(classes.filtersClosed);
  });

  test('display the title filter', () => {
    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesToolbar />
      </Provider>,
    );

    const titleFilter = view.queryByPlaceholderText(/Search by title/i);

    expect(titleFilter).toBeInTheDocument();
  });

  test('execute category set filters store function with expected parameters', () => {
    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesToolbar />
      </Provider>,
    );

    const titleFilter = view.queryByPlaceholderText(/Search by title/i);

    userEvent.type(titleFilter as HTMLElement, 'a');

    expect(categoriesStoreSetFilters).toBeCalled();
    expect(categoriesStoreSetFilters).toBeCalledTimes(1);
    expect(categoriesStoreSetFilters).toBeCalledWith('title', 'a');
  });

  test('display the clear filters button', () => {
    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesToolbar />
      </Provider>,
    );

    const clearButton = view.queryByLabelText(/clear filters/i);

    expect(clearButton).toBeInTheDocument();
  });

  test('execute category clear filters store function', () => {
    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesToolbar />
      </Provider>,
    );

    const clearButton = view.queryByLabelText(/clear filters/i);

    userEvent.click(clearButton as HTMLElement);

    expect(categoriesStoreClearFilters).toBeCalled();
    expect(categoriesStoreClearFilters).toBeCalledTimes(1);
  });

  test('display add category button', () => {
    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesToolbar />
      </Provider>,
    );

    const addButton = view.queryByRole('button', { name: /add category/i });

    expect(addButton).toBeInTheDocument();
  });

  test('display dialog by clicking on add category button', () => {
    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesToolbar />
      </Provider>,
    );

    const modalBefore = screen.queryByRole('dialog');
    expect(modalBefore).not.toBeInTheDocument();

    const addButton = view.queryByRole('button', { name: /add category/i });
    userEvent.click(addButton as HTMLElement);

    const modalAfter = screen.queryByRole('dialog');
    expect(modalAfter).toBeInTheDocument();
  });

  test('display "More actions" button', () => {
    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesToolbar />
      </Provider>,
    );

    const moreActionsButton = view.queryByLabelText(/more actions button/);

    expect(moreActionsButton).toBeInTheDocument();
  });

  test('display menu by clicking on "More actions" button', async () => {
    const view = render(
      <Provider categoriesStore={categoriesStore}>
        <CategoriesToolbar />
      </Provider>,
    );

    const moreActionsMenuBefore = screen.queryByLabelText(/more actions menu/);
    expect(moreActionsMenuBefore).not.toBeInTheDocument();

    const moreActionsButton = view.queryByLabelText(/more actions button/);

    act(() => {
      userEvent.click(moreActionsButton as HTMLElement);
    });

    await waitFor(() => {
      const moreActionsMenuAfter = screen.getByLabelText(/more actions menu/);
      expect(moreActionsMenuAfter).toBeInTheDocument();
    });
  });
});
