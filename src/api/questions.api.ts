import { IndexableType } from 'dexie';

import { db } from './indexedDB';
import {
  QuizQuestion,
  AddQuizQuestion,
  GetQuizQuestion,
} from '../models/question.model';
import { APIResponse, APIResponseStatusEnum } from '../models/api.model';
import DEFAULT_QUESTIONS from '../data/questions.json';
import { QuizQuestionCategory } from '../models/category.model';

class QuestionsAPI {
  async getQuestions(): Promise<APIResponse<GetQuizQuestion[]>> {
    try {
      const quesitons = await db.questions.toArray();
      const categories = await db.categories.toArray();

      const modifiedQuestions = quesitons.map((question) => {
        const foundCategory = categories.find(
          (category) => category.id === question.category,
        );
        return {
          id: question.id,
          categoryId: question.category,
          categoryName: foundCategory?.title || '',
          title: question.title,
          level: question.level,
          answer: question.answer,
        } as GetQuizQuestion;
      });

      return {
        status: APIResponseStatusEnum.success,
        data: modifiedQuestions,
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async getQuestionsByIds(
    ids: number[],
  ): Promise<APIResponse<GetQuizQuestion[]>> {
    try {
      const quesitons = await db.questions.where('id').anyOf(ids).toArray();
      const categories = await db.categories.toArray();

      const modifiedQuestions = quesitons.map((question) => {
        const foundCategory = categories.find(
          (category) => category.id === question.category,
        );
        return {
          id: question.id,
          categoryId: question.category,
          categoryName: foundCategory?.title || '',
          title: question.title,
          level: question.level,
          answer: question.answer,
        } as GetQuizQuestion;
      });

      return {
        status: APIResponseStatusEnum.success,
        data: modifiedQuestions,
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async getQuestion(id: number): Promise<APIResponse<GetQuizQuestion | null>> {
    try {
      const question = await db.questions.get(id);
      let category: QuizQuestionCategory | undefined;
      let modifiedQuestion: GetQuizQuestion | null = null;
      if (question) {
        category = await db.categories.get(question?.category);
        modifiedQuestion = {
          id: question.id as number,
          categoryId: question.category,
          categoryName: category?.title || '',
          title: question.title,
          level: question.level,
          answer: question.answer,
        };
      }

      return {
        status: APIResponseStatusEnum.success,
        data: modifiedQuestion,
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async addQuestion(data: AddQuizQuestion): Promise<APIResponse<number>> {
    try {
      const id = await db.questions.add({
        answer: data.answer,
        category: data.category,
        title: data.title,
        level: data.level,
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

  async addQuestionsBulk(data: QuizQuestion[]): Promise<APIResponse<number>> {
    try {
      const mappedData = data.map((el) => {
        return {
          answer: el.answer,
          category: el.category,
          title: el.title,
          level: el.level,
        };
      });
      const lastId = await db.questions.bulkAdd(mappedData);
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

  async addAndUpdateQuestionsBulk(
    data: QuizQuestion[],
  ): Promise<APIResponse<number>> {
    try {
      const lastId = await db.questions.bulkPut(data);
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

  async editQuestion(
    id: number,
    data: AddQuizQuestion,
  ): Promise<APIResponse<number>> {
    try {
      await db.questions.update(id as IndexableType, {
        answer: data.answer,
        category: data.category,
        title: data.title,
        level: data.level,
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

  async deleteQuestion(id: number): Promise<APIResponse<number>> {
    try {
      await db.questions.delete(id as IndexableType);
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

  async setDefaultQuestions(): Promise<APIResponse<null>> {
    try {
      await db.quiz.clear();
      await db.questions.clear();

      const defaultQuestions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
      await db.questions.bulkAdd(defaultQuestions);

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

const QuestionsAPIInstance = new QuestionsAPI();

Object.freeze(QuestionsAPIInstance);

export default QuestionsAPIInstance;
