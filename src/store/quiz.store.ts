import { action, computed, makeObservable, observable } from 'mobx';
import GlossaryAPIInstance from '../api/glossary.api';
import QuizAPIInstance from '../api/quiz.api';
import { QuizQuestion } from '../models/question.model';
import {
  QuizCreationData,
  QuizData,
  QuizQuestionAnswerType,
} from '../models/quiz.model';

class QuizStore {
  @observable questionIds: number[] = [];
  @observable completedQuestionIds: number[] = [];
  @observable notCompletedQuestionIds: number[] = [];
  @observable questions: QuizQuestion[] = [];
  @observable areQuestionsFetching: boolean = false;
  @observable currentQuestionId: number | null = null;

  @computed get isIterationCompleted(): boolean {
    return (
      this.questionIds.length ===
      this.completedQuestionIds.length + this.notCompletedQuestionIds.length
    );
  }

  @computed get isQuizFullyCompleted(): boolean {
    return this.questionIds.length === this.completedQuestionIds.length;
  }

  @computed get currentQuestion(): QuizQuestion | undefined {
    return this.questions.find((el) => el.id === this.currentQuestionId);
  }

  @observable setQuestionsIds(ids: number[]): void {
    this.questionIds = ids;
  }

  @observable setCompletedQuestionsIds(ids: number[]): void {
    this.completedQuestionIds = ids;
  }

  @observable setNotCompletedQuestionsIds(ids: number[]): void {
    this.notCompletedQuestionIds = ids;
  }

  @observable setQuestions(questions: QuizQuestion[]): void {
    this.questions = questions;
  }

  @observable setAreQuestionsFetching(status: boolean): void {
    this.areQuestionsFetching = status;
  }
  @observable setCurrentQuestionId(id: number | null): void {
    this.currentQuestionId = id;
  }

  @action getQuizData(callback?: (data: QuizData | null) => void): void {
    QuizAPIInstance.getQuiz().then((res) => {
      this.setQuestionsIds(res.data?.questionIds || []);
      this.setCompletedQuestionsIds(res.data?.completedQuestionIds || []);
      this.setNotCompletedQuestionsIds(res.data?.notCompletedQuestionIds || []);

      if (callback) {
        callback(res.data || null);
      }
    });
  }

  @action createQuiz(data: QuizCreationData): void {
    QuizAPIInstance.createQuiz(data).then((res) => {
      this.setQuestionsIds(res.data?.questionIds || []);
      this.setCompletedQuestionsIds(res.data?.completedQuestionIds || []);
      this.setNotCompletedQuestionsIds(res.data?.notCompletedQuestionIds || []);
    });
  }

  @action getQuestions(): void {
    if (this.questionIds.length) {
      this.setAreQuestionsFetching(true);

      GlossaryAPIInstance.getQuestionsByIds(this.questionIds).then((res) => {
        this.setQuestions(res.data || []);
        if (this.questionIds.length) {
          this.setCurrentQuestionId(this.questionIds[0]);
        }
        this.setAreQuestionsFetching(false);
      });
    }
  }

  @action answerQuiz(result: QuizQuestionAnswerType): void {
    if (!this.currentQuestionId) {
      return;
    }

    QuizAPIInstance.answearQuizQuestion(this.currentQuestionId, result).then(
      () => {
        const currentQuestionIndex = this.questionIds.findIndex(
          (el) => el === this.currentQuestionId,
        );

        if (this.questionIds.length - 1 > currentQuestionIndex) {
          this.setCurrentQuestionId(this.questionIds[currentQuestionIndex + 1]);
        }
        if (this.questionIds.length - 1 === currentQuestionIndex) {
          this.setCurrentQuestionId(null);
        }

        this.getQuizData();
      },
    );
  }

  @action finishQuiz(): void {
    QuizAPIInstance.finishQuiz().then(() => {
      const callback = (data: QuizData | null) => {
        if (data && data.questionIds.length) {
          this.setCurrentQuestionId(data.questionIds[0]);
        }
      };

      this.getQuizData(callback);
    });
  }

  @action clearQuiz(): void {
    QuizAPIInstance.clearQuiz().then(() => {
      this.getQuizData();
    });
  }

  constructor() {
    makeObservable(this);
  }
}

export default QuizStore;
