import { QuizletQuestionCategoryEnum } from './category';

export interface QuizletQuestionLink {
  label: string;
  href: string;
}

export interface QuizletQuestion {
  id: number;
  title: string;
  category: QuizletQuestionCategoryEnum[];
  level: number;
  answer: string;
  links?: QuizletQuestionLink[];
  toBeReviewed?: boolean;
  isPractise?: boolean;
}
