import Dexie, { Table } from 'dexie';
import { QuizData } from '../models/quiz.model';
import { QuizletQuestion } from './../models/question.model';

export class IndexedDB extends Dexie {
  glossary!: Table<QuizletQuestion>;
  quiz!: Table<QuizData>;

  constructor() {
    super('ITinterviewer');
    this.version(1).stores({
      glossary: '++id, category',
      quiz: '++id',
    });
  }
}

export const db = new IndexedDB();
