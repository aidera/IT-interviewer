import { db } from './indexedDB';
import { APIResponse, APIResponseStatusEnum } from '../models/api.model';
import { AddLearnLog, GetLearnLog } from '../models/log.model';

class LogsAPI {
  async getLearnLogs(): Promise<APIResponse<GetLearnLog[]>> {
    try {
      const logs = (await db.learnLogs.toArray()) as GetLearnLog[];

      return {
        status: APIResponseStatusEnum.success,
        data: logs,
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async addLearnLog(data: AddLearnLog): Promise<APIResponse<number>> {
    try {
      const id = await db.learnLogs.add({
        date: new Date().toString(),
        type: data.type,
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
}

const LogsAPIInstance = new LogsAPI();

Object.freeze(LogsAPIInstance);

export default LogsAPIInstance;
