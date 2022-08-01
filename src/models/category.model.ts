export enum QuizletQuestionCategoryEnum {
  none,
  common,
  markup,
  javascript,
  typescript,
  frontend,
  angular,
  rxjs,
  react,
  redux,
  git,
  other,
}

export interface QuizletQuestionCategory {
  id: QuizletQuestionCategoryEnum;
  label: string;
}
