import { GetQuizQuestion, QuizQuestion } from './../models/question.model';

export const convertGetQuestionToBare = (
  question: GetQuizQuestion,
): QuizQuestion => {
  return {
    id: question.id,
    title: question.title,
    category: question.categoryId,
    level: question.level,
    answer: question.answer,
  };
};
