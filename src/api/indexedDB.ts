import Dexie, { Table } from 'dexie';
import { QuizletQuestionCategory } from '../models/category.model';
import { QuizData } from '../models/quiz.model';
import { QuizletQuestion } from './../models/question.model';

export class IndexedDB extends Dexie {
  categories!: Table<QuizletQuestionCategory>;
  glossary!: Table<QuizletQuestion>;
  quiz!: Table<QuizData>;

  constructor() {
    super('ITinterviewer');
    this.version(1).stores({
      categories: '++id',
      glossary: '++id, category',
      quiz: '++id',
    });
  }
}

export const db = new IndexedDB();
