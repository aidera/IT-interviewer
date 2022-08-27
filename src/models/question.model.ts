export interface QuizQuestionLink {
  label: string;
  href: string;
}

export interface QuizQuestion {
  id?: number;
  title: string;
  category: number;
  level: number;
  answer: string;
  links?: QuizQuestionLink[];
  toBeReviewed?: boolean;
  isPractise?: boolean;
}

export type AddQuizQuestion = Pick<
  QuizQuestion,
  'title' | 'category' | 'level' | 'answer'
>;

export type EditQuizQuestion = Pick<
  QuizQuestion,
  'id' | 'title' | 'category' | 'level' | 'answer'
>;
