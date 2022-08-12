import { QuizletQuestion } from './../models/question.model';
import { APIResponse, APIResponseStatusEnum } from '../models/api.model';
import { AddQuizletQuestion } from '../models/question.model';
import { db } from './indexedDB';
import { IndexableType } from 'dexie';

class GlossaryAPI {
  async getQuestions(): Promise<APIResponse<QuizletQuestion[]>> {
    try {
      const quesitons = await db.glossary.toArray();
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

  async addQuestion(data: AddQuizletQuestion): Promise<APIResponse<number>> {
    try {
      const id = await db.glossary.add({
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

  async addQuestionsBulk(
    data: QuizletQuestion[],
  ): Promise<APIResponse<number>> {
    try {
      const mappedData = data.map((el) => {
        return {
          answer: el.answer,
          category: el.category,
          title: el.title,
          level: el.level,
        };
      });
      const lastId = await db.glossary.bulkAdd(mappedData);
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
    data: QuizletQuestion[],
  ): Promise<APIResponse<number>> {
    try {
      const lastId = await db.glossary.bulkPut(data);
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
    data: AddQuizletQuestion,
  ): Promise<APIResponse<number>> {
    try {
      await db.glossary.update(id as IndexableType, {
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
      await db.glossary.delete(id as IndexableType);
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

const GlossaryAPIInstance = new GlossaryAPI();

Object.freeze(GlossaryAPIInstance);

export default GlossaryAPIInstance;
