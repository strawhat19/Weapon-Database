import type { DataRecord } from '../../types/types';

export class Data {
  readonly id: string;
  readonly number: number;
  readonly createdAt: string;
  name: string;
  updatedAt: string;
  constructor(record: DataRecord) {
    this.id = record.id;
    this.name = record.name;
    this.number = record.number;
    this.createdAt = record.createdAt;
    this.updatedAt = record.updatedAt;
  }
  toRecord(): DataRecord {
    return { id: this.id, name: this.name, number: this.number, createdAt: this.createdAt, updatedAt: this.updatedAt };
  }
}

