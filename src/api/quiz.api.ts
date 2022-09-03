import {
  QuizCreationData,
  QuizData,
  QuizQuestionAnswerType,
} from '../models/quiz.model';
import { APIResponse, APIResponseStatusEnum } from '../models/api.model';
import { db } from './indexedDB';

class QuizAPI {
  async getQuiz(): Promise<APIResponse<QuizData | null>> {
    try {
      const quiz = await db.quiz.toArray();
      return {
        status: APIResponseStatusEnum.success,
        data: quiz.length ? quiz[0] : null,
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async createQuiz(
    data: QuizCreationData,
  ): Promise<APIResponse<QuizData | null>> {
    try {
      // Unfortunately, only one clause is available
      let questions = await db.questions
        .where('category')
        .anyOf(data.categories)
        .toArray();

      questions = questions.filter((el) => {
        if (data.levelFrom && data.levelTo) {
          return el.level >= data.levelFrom && el.level <= data.levelTo;
        } else if (data.levelFrom) {
          return el.level >= data.levelFrom;
        } else if (data.levelTo) {
          return el.level <= data.levelTo;
        } else {
          return true;
        }
      });

      const shuffled = questions.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, data.questionsCount);

      await db.quiz.clear();

      const quizData: QuizData | null = selected.length
        ? {
            questionIds: selected.map((el) => el.id as number),
            completedQuestionIds: [],
            notCompletedQuestionIds: [],
          }
        : null;

      if (quizData) {
        await db.quiz.add(quizData);
      }

      return {
        status: APIResponseStatusEnum.success,
        data: quizData,
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async updateQuiz(quizData: QuizData): Promise<APIResponse<number>> {
    try {
      await db.quiz.clear();

      const id = await db.quiz.add(quizData);
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

  async answearQuizQuestion(
    questionId: number,
    result: QuizQuestionAnswerType,
  ): Promise<APIResponse<string>> {
    try {
      let response: string;
      const quiz = await db.quiz.toArray();

      if (quiz[0].questionIds.includes(questionId)) {
        const newQuiz: QuizData = JSON.parse(JSON.stringify(quiz[0]));

        newQuiz.completedQuestionIds = newQuiz.completedQuestionIds.filter(
          (id) => id !== questionId,
        );
        newQuiz.notCompletedQuestionIds =
          newQuiz.notCompletedQuestionIds.filter((id) => id !== questionId);

        if (result === QuizQuestionAnswerType.completed) {
          newQuiz.completedQuestionIds.push(questionId);
        } else {
          newQuiz.notCompletedQuestionIds.push(questionId);
        }

        await db.quiz.clear();
        await db.quiz.add(newQuiz);

        response = 'Updated';
      } else {
        response = 'Question ID not found in quiz questions array';
      }

      return {
        status: APIResponseStatusEnum.success,
        data: response,
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async finishQuiz(): Promise<APIResponse<string>> {
    try {
      let response: string;
      const quiz = await db.quiz.toArray();
      if (quiz?.[0]) {
        const newQuiz: QuizData = JSON.parse(JSON.stringify(quiz[0]));

        newQuiz.questionIds = newQuiz.questionIds.filter(
          (id) => !newQuiz.completedQuestionIds.includes(id),
        );
        newQuiz.completedQuestionIds = [];
        newQuiz.notCompletedQuestionIds = [];

        await db.quiz.clear();
        await db.quiz.add(newQuiz);

        response = 'Finished Iteration';
      } else {
        response = 'Quiz not found';
      }

      return {
        status: APIResponseStatusEnum.success,
        data: response,
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }

  async clearQuiz(): Promise<APIResponse<null>> {
    try {
      await db.quiz.clear();

      return {
        status: APIResponseStatusEnum.success,
        data: null,
      };
    } catch (error) {
      return {
        status: APIResponseStatusEnum.error,
        error: error as string,
      };
    }
  }
}

const QuizAPIInstance = new QuizAPI();

Object.freeze(QuizAPIInstance);

export default QuizAPIInstance;
