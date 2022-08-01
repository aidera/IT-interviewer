import {
  QuizletQuestionCategory,
  QuizletQuestionCategoryEnum,
} from '../models/category.model';

export const CATEGORIES: QuizletQuestionCategory[] = [
  {
    id: QuizletQuestionCategoryEnum.common,
    label: 'Common',
  },
  {
    id: QuizletQuestionCategoryEnum.markup,
    label: 'Markup (HTML & CSS)',
  },
  {
    id: QuizletQuestionCategoryEnum.javascript,
    label: 'Javascript',
  },
  {
    id: QuizletQuestionCategoryEnum.typescript,
    label: 'Typescript',
  },
  {
    id: QuizletQuestionCategoryEnum.frontend,
    label: 'Frontend & Browser',
  },
  {
    id: QuizletQuestionCategoryEnum.angular,
    label: 'Angular',
  },
  {
    id: QuizletQuestionCategoryEnum.rxjs,
    label: 'RxJS',
  },
  {
    id: QuizletQuestionCategoryEnum.react,
    label: 'React JS',
  },
  {
    id: QuizletQuestionCategoryEnum.redux,
    label: 'Redux',
  },
  {
    id: QuizletQuestionCategoryEnum.git,
    label: 'Git & GitHub',
  },
  {
    id: QuizletQuestionCategoryEnum.other,
    label: 'Other',
  },
];
