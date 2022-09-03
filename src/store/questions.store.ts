import { action, computed, makeObservable, observable } from 'mobx';
import { EditQuizQuestion } from './../models/question.model';
import { APIResponse } from '../models/api.model';
import { QuizQuestion } from '../models/question.model';
import QuestionsAPIInstance from '../api/questions.api';

export interface IQuestionsStoreFilters {
  title: string;
  level: number[];
}

class QuestionsStore {
  @observable questions: QuizQuestion[] = [];
  @observable isFetching: boolean = false;
  @observable filters: IQuestionsStoreFilters = { title: '', level: [] };

  @computed get filteredQuestions(): QuizQuestion[] {
    const filtered = this.questions.filter((question) => {
      const clearedTitle = question.title.trim().toLowerCase();
      const clearedTitleFilter = this.filters.title.trim().toLowerCase();
      const titleFits = clearedTitle.includes(clearedTitleFilter);
      const levelFits =
        this.filters.level.includes(question.level) ||
        this.filters.level.length === 0;

      return titleFits && levelFits;
    });

    return filtered;
  }

  @action setQuestions(questions: QuizQuestion[]): void {
    this.questions = questions;
  }

  @action setIsFetching(status: boolean): void {
    this.isFetching = status;
  }

  @action getQuestions(callback?: (questions: QuizQuestion[]) => void): void {
    this.setIsFetching(true);
    QuestionsAPIInstance.getQuestions()
      .then((res) => {
        if (res.data) {
          this.setQuestions(res.data);
          callback?.(res.data);
        }
      })
      .finally(() => {
        this.setIsFetching(false);
      });
  }

  @action addQuestion(question: EditQuizQuestion, callback?: () => void): void {
    QuestionsAPIInstance.addQuestion(question).then(() => {
      this.getQuestions();
      callback?.();
    });
  }

  @action editQuestion(
    id: number,
    question: EditQuizQuestion,
    callback?: () => void,
  ): void {
    QuestionsAPIInstance.editQuestion(id, question).then(() => {
      this.getQuestions();
      callback?.();
    });
  }

  @action uploadBulkQuestions(
    type: 'add' | 'overwrite',
    questions: EditQuizQuestion[],
    callback?: () => void,
  ): void {
    let request: Promise<APIResponse<number>>;

    switch (type) {
      case 'add':
        request = QuestionsAPIInstance.addQuestionsBulk(questions);
        break;
      case 'overwrite':
        request = QuestionsAPIInstance.addAndUpdateQuestionsBulk(questions);
        break;
    }

    request
      .then((res) => {
        if (res.data) {
          this.getQuestions();
        }
      })
      .finally(() => {
        callback?.();
      });
  }

  @action deleteQuestion(id: number): void {
    QuestionsAPIInstance.deleteQuestion(id).then((res) => {
      if (res.data) {
        this.setQuestions(this.questions.filter((el) => el.id !== id));
      }
    });
  }

  @action setDefaultQuestions(callback?: () => void): void {
    QuestionsAPIInstance.setDefaultQuestions().then(() => {
      this.getQuestions();
      callback?.();
    });
  }

  @action setFilters(type: keyof IQuestionsStoreFilters, value: any) {
    this.filters[type] = value;
  }

  constructor() {
    makeObservable(this);
  }
}

export default QuestionsStore;