import { IndexableType } from 'dexie';

import { db } from './indexedDB';
import { QuizQuestion, AddQuizQuestion } from '../models/question.model';
import { APIResponse, APIResponseStatusEnum } from '../models/api.model';
import DEFAULT_QUESTIONS from '../data/questions.json';

class QuestionsAPI {
  async getQuestions(): Promise<APIResponse<QuizQuestion[]>> {
    try {
      const quesitons = await db.questions.toArray();
      return {
        status: APIResponseStatusEnum.success,
        data: quesitons.sort((a, b) => {
          return a.level - b.level || a.title.localeCompare(b.title);
        }),
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async getQuestionsByIds(ids: number[]): Promise<APIResponse<QuizQuestion[]>> {
    try {
      const quesitons = await db.questions.where('id').anyOf(ids).toArray();
      return {
        status: APIResponseStatusEnum.success,
        data: quesitons,
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async getQuestion(id: number): Promise<APIResponse<QuizQuestion>> {
    try {
      const quesiton = await db.questions.get(id);
      return {
        status: APIResponseStatusEnum.success,
        data: quesiton,
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
