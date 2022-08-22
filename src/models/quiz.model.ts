export interface QuizData {
  questionIds: number[];
  completedQuestionIds: number[];
  notCompletedQuestionIds: number[];
}

export enum QuizQuestionAnswerType {
  completed,
  notCompleted,
}

export interface QuizCreationData {
  questionsCount: number;
  levelFrom?: number;
  levelTo?: number;
  categories: number[];
}
