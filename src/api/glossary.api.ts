import { IndexableType } from 'dexie';
import { APIResponse, APIResponseStatusEnum } from '../models/api.model';
import { db } from './indexedDB';

class GlossaryAPI {
  async addQuestion(data: any): Promise<APIResponse<number>> {
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
        status: APIResponseStatusEnum.success,
        error: error as string,
      };
    }
  }
}

const GlossaryAPIInstance = new GlossaryAPI();

Object.freeze(GlossaryAPIInstance);

export default GlossaryAPIInstance;
