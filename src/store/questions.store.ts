import { action, computed, makeObservable, observable } from 'mobx';

import { EditQuizQuestion, GetQuizQuestion } from './../models/question.model';
import { APIResponse } from '../models/api.model';
import QuestionsAPIInstance from '../api/questions.api';

export interface IQuestionsStoreFilters {
  title: string;
  level: number[];
  category: number[];
}

class QuestionsStore {
  @observable questions: GetQuizQuestion[] = [];
  @observable isFetching: boolean = false;
  @observable filters: IQuestionsStoreFilters = {
    title: '',
    level: [],
    category: [],
  };

  @computed get filteredQuestions(): GetQuizQuestion[] {
    const filtered = this.questions.filter((question) => {
      const clearedTitle = question.title.trim().toLowerCase();
      const clearedTitleFilter = this.filters.title.trim().toLowerCase();
      const titleFits = clearedTitle.includes(clearedTitleFilter);
      const levelFits =
        this.filters.level.includes(question.level) ||
        this.filters.level.length === 0;
      const categoryFits =
        this.filters.category.includes(question.categoryId) ||
        this.filters.category.length === 0;

      return titleFits && levelFits && categoryFits;
    });

    return filtered;
  }

  @action setQuestions(questions: GetQuizQuestion[]): void {
    this.questions = questions;
  }

  @action setIsFetching(status: boolean): void {
    this.isFetching = status;
  }

  @action getQuestions(
    callback?: (questions: GetQuizQuestion[]) => void,
  ): void {
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

  @action clearFilters() {
    this.filters = {
      title: '',
      level: [],
      category: [],
    };
  }

  constructor() {
    makeObservable(this);
  }
}

export default QuestionsStore;
