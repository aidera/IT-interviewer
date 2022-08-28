import { IndexableType } from 'dexie';
import { db } from './indexedDB';
import { QuizQuestion } from './../models/question.model';
import { APIResponse, APIResponseStatusEnum } from '../models/api.model';
import { AddQuizQuestion } from '../models/question.model';
import DEFAULT_QUESTIONS from '../data/questions.json';

class GlossaryAPI {
  async getQuestions(): Promise<APIResponse<QuizQuestion[]>> {
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

  async getQuestionsByIds(ids: number[]): Promise<APIResponse<QuizQuestion[]>> {
    try {
      const quesitons = await db.glossary.where('id').anyOf(ids).toArray();
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
      const quesiton = await db.glossary.get(id);
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
    data: QuizQuestion[],
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
    data: AddQuizQuestion,
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

  async setDefaultQuestions(): Promise<APIResponse<null>> {
    try {
      await db.quiz.clear();
      await db.glossary.clear();

      const defaultQuestions = JSON.parse(JSON.stringify(DEFAULT_QUESTIONS));
      await db.glossary.bulkAdd(defaultQuestions);

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

const GlossaryAPIInstance = new GlossaryAPI();

Object.freeze(GlossaryAPIInstance);

export default GlossaryAPIInstance;
