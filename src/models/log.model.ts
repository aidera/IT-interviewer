export interface LearnLog {
  id?: number;
  date: string;
  type: LearnLogType;
}

export type LearnLogType = 'ITERATION' | 'FINISHING';

export interface GetLearnLog extends LearnLog {
  id: number;
}

export interface AddLearnLog {
  type: LearnLogType;
}
