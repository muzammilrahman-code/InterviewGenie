import { pgTable, text, timestamp, integer, jsonb, varchar } from 'drizzle-orm/pg-core';

export const interviews = pgTable('interviews', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: text('user_id').notNull(),
  jobPosition: text('job_position').notNull(),
  jobDescription: text('job_description').notNull(),
  experience: text('experience').notNull(),
  status: text('status').notNull().default('not-started'), // 'not-started', 'in-progress', 'completed', 'ready'
  questions: jsonb('questions').default([]),
  answers: jsonb('answers').default([]),
  feedback: jsonb('feedback'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
});