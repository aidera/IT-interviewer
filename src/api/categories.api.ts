import { IndexableType } from 'dexie';
import { db } from './indexedDB';
import { APIResponse, APIResponseStatusEnum } from '../models/api.model';
import {
  EditQuizQuestionCategory,
  QuizQuestionCategory,
} from '../models/category.model';
import DEFAULT_CATEGORIES from '../data/categories.json';

class CategoriesAPI {
  async getCategories(): Promise<APIResponse<QuizQuestionCategory[]>> {
    try {
      const categories = await db.categories.toArray();
      return {
        status: APIResponseStatusEnum.success,
        data: categories,
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async getCategory(id: number): Promise<APIResponse<QuizQuestionCategory>> {
    try {
      const category = await db.categories.get(id);
      return {
        status: APIResponseStatusEnum.success,
        data: category,
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async addCategory(
    data: EditQuizQuestionCategory,
  ): Promise<APIResponse<number>> {
    console.log('add');
    try {
      const id = await db.categories.add({
        title: data.title,
      });
      console.log(id);
      return {
        status: APIResponseStatusEnum.success,
        data: +id.toString(),
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async addCategoriesBulk(
    data: QuizQuestionCategory[],
  ): Promise<APIResponse<number>> {
    try {
      const mappedData = data.map((el) => {
        return {
          title: el.title,
        };
      });
      const lastId = await db.categories.bulkAdd(mappedData);
      return {
        status: APIResponseStatusEnum.success,
        data: +lastId.toString(),
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async addAndUpdateCategoriesBulk(
    data: QuizQuestionCategory[],
  ): Promise<APIResponse<number>> {
    try {
      const lastId = await db.categories.bulkPut(data);
      return {
        status: APIResponseStatusEnum.success,
        data: +lastId.toString(),
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async editCategory(
    id: number,
    data: EditQuizQuestionCategory,
  ): Promise<APIResponse<number>> {
    try {
      await db.categories.update(id as IndexableType, {
        title: data.title,
      });
      return {
        status: APIResponseStatusEnum.success,
        data: +id.toString(),
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async deleteCategory(id: number): Promise<APIResponse<number>> {
    try {
      await db.categories.delete(id as IndexableType);
      return {
        status: APIResponseStatusEnum.success,
        data: +id.toString(),
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async setDefaultCategories(): Promise<APIResponse<null>> {
    try {
      await db.quiz.clear();
      await db.glossary.clear();
      await db.categories.clear();

      const defaultCategories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
      await db.categories.bulkAdd(defaultCategories);

      return {
        status: APIResponseStatusEnum.success,
        data: null,
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }
}

const CategoriesAPIInstance = new CategoriesAPI();

Object.freeze(CategoriesAPIInstance);

export default CategoriesAPIInstance;
