import Dexie, { Table } from 'dexie';
import { QuizletQuestion } from './../models/question.model';

export class IndexedDB extends Dexie {
  glossary!: Table<QuizletQuestion>;

  constructor() {
    super('ITinterviewer');
    this.version(1).stores({
      glossary: '++id',
    });
  }
}

export const db = new IndexedDB();
