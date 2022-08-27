import Dexie, { Table } from 'dexie';
import { QuizQuestionCategory } from '../models/category.model';
import { QuizData } from '../models/quiz.model';
import { QuizQuestion } from './../models/question.model';

export class IndexedDB extends Dexie {
  categories!: Table<QuizQuestionCategory>;
  glossary!: Table<QuizQuestion>;
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
