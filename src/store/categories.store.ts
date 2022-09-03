import { action, computed, makeObservable, observable } from 'mobx';
import { QuizQuestionCategory } from '../models/category.model';
import CategoriesAPIInstance from '../api/categories.api';
import { APIResponse } from '../models/api.model';

export interface ICategoriesStoreFilters {
  title: string;
}

class CategoriesStore {
  @observable categories: QuizQuestionCategory[] = [];
  @observable isFetching: boolean = false;
  @observable filters: ICategoriesStoreFilters = { title: '' };

  @computed get filteredCategories(): QuizQuestionCategory[] {
    const filtered = this.categories.filter((category) => {
      const clearedTitle = category.title.trim().toLowerCase();
      const clearedTitleFilter = this.filters.title.trim().toLowerCase();
      const titleFits = clearedTitle.includes(clearedTitleFilter);

      return titleFits;
    });

    return filtered;
  }

  @action setCategories(categories: QuizQuestionCategory[]): void {
    this.categories = categories;
  }

  @action setIsFetching(status: boolean): void {
    this.isFetching = status;
  }

  @action getCategories(): void {
    this.setIsFetching(true);
    CategoriesAPIInstance.getCategories()
      .then((res) => {
        if (res.data) {
          this.setCategories(res.data);
        }
      })
      .finally(() => {
        this.setIsFetching(false);
      });
  }

  @action setFilters(type: keyof ICategoriesStoreFilters, value: string) {
    this.filters[type] = value;
  }

  @action uploadBulkCategories(
    type: 'add' | 'overwrite',
    categories: QuizQuestionCategory[],
    callback?: () => void,
  ): void {
    let request: Promise<APIResponse<number>>;

    switch (type) {
      case 'add':
        request = CategoriesAPIInstance.addCategoriesBulk(categories);
        break;
      case 'overwrite':
        request = CategoriesAPIInstance.addAndUpdateCategoriesBulk(categories);
        break;
    }

    request
      .then((res) => {
        if (res.data) {
          this.getCategories();
        }
      })
      .finally(() => {
        callback?.();
      });
  }

  @action deleteCategory(id: number): void {
    CategoriesAPIInstance.deleteCategory(id).then((res) => {
      if (res.data) {
        this.setCategories(this.categories.filter((el) => el.id !== id));
      }
    });
  }

  constructor() {
    makeObservable(this);
  }
}

export default CategoriesStore;
