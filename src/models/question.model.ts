export interface QuizQuestion {
  id?: number;
  title: string;
  category: number;
  level: number;
  answer: string;
}

export type AddQuizQuestion = Pick<
  QuizQuestion,
  'title' | 'category' | 'level' | 'answer'
>;

export type EditQuizQuestion = Pick<
  QuizQuestion,
  'id' | 'title' | 'category' | 'level' | 'answer'
>;
