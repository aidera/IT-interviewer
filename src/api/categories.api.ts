import { IndexableType } from 'dexie';
import { db } from './indexedDB';
import { APIResponse, APIResponseStatusEnum } from '../models/api.model';
import {
  EditQuizletQuestionCategory,
  QuizletQuestionCategory,
} from '../models/category.model';

class CategoriesAPI {
  async getCategories(): Promise<APIResponse<QuizletQuestionCategory[]>> {
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

  async getCategory(id: number): Promise<APIResponse<QuizletQuestionCategory>> {
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
    data: EditQuizletQuestionCategory,
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
    data: QuizletQuestionCategory[],
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
    data: QuizletQuestionCategory[],
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
    data: EditQuizletQuestionCategory,
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
}

const CategoriesAPIInstance = new CategoriesAPI();

Object.freeze(CategoriesAPIInstance);

export default CategoriesAPIInstance;
