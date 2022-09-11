import { action, computed, makeObservable, observable } from 'mobx';

import { APIResponse } from '../models/api.model';
import {
  EditQuizQuestionCategory,
  QuizQuestionCategory,
} from '../models/category.model';
import CategoriesAPIInstance from '../api/categories.api';

export interface ICategoriesStoreFilters {
  title: string;
}

class CategoriesStore {
  @observable categories: QuizQuestionCategory[] = [];
  @observable isFetching: boolean = false;
  @observable isUpdating: boolean = false;
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

  @action setIsUpdating(status: boolean): void {
    this.isUpdating = status;
  }

  @action getCategories(useUpdatingInsteadOfetching: boolean = false): void {
    if (useUpdatingInsteadOfetching) {
      this.setIsUpdating(true);
    } else {
      this.setIsFetching(true);
    }

    CategoriesAPIInstance.getCategories()
      .then((res) => {
        if (res.data) {
          this.setCategories(res.data);
        }
      })
      .finally(() => {
        if (useUpdatingInsteadOfetching) {
          this.setIsUpdating(false);
        } else {
          this.setIsFetching(false);
        }
      });
  }

  @action addCategory(
    category: EditQuizQuestionCategory,
    callback?: () => void,
  ): void {
    CategoriesAPIInstance.addCategory(category).then(() => {
      this.getCategories(true);
      callback?.();
    });
  }

  @action editCategory(
    id: number,
    category: EditQuizQuestionCategory,
    callback?: () => void,
  ): void {
    CategoriesAPIInstance.editCategory(id, category).then(() => {
      this.getCategories(true);
      callback?.();
    });
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

  @action setDefaultCategories(callback?: () => void): void {
    CategoriesAPIInstance.setDefaultCategories().then(() => {
      this.getCategories();
      callback?.();
    });
  }

  @action setFilters(type: keyof ICategoriesStoreFilters, value: any) {
    this.filters[type] = value;
  }

  @action clearFilters() {
    this.filters = {
      title: '',
    };
  }

  constructor() {
    makeObservable(this);
  }
}

export default CategoriesStore;
