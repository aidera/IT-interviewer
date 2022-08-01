import Dexie, { Table } from 'dexie';
import { EditQuizletQuestion } from '../models/question.model';

export class IndexedDB extends Dexie {
  glossary!: Table<EditQuizletQuestion>;

  constructor() {
    super('ITinterviewer');
    this.version(1).stores({
      glossary: '++id',
    });
  }
}

export const db = new IndexedDB();
