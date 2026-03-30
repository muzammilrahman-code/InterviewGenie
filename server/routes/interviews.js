import { Router } from 'express';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { db, interviews } from '../db/index.js';

const router = Router();

// GET /api/interviews?userId=xxx
router.get('/', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const result = await db
      .select()
      .from(interviews)
      .where(eq(interviews.userId, userId))
      .orderBy(interviews.createdAt);
    res.json(result);
  } catch (error) {
    console.error('Error getting interviews:', error);
    res.status(500).json({ error: 'Failed to get interviews' });
  }
});

// GET /api/interviews/stats?userId=xxx
router.get('/stats', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const all = await db
      .select()
      .from(interviews)
      .where(eq(interviews.userId, userId));

    res.json({
      total: all.length,
      completed: all.filter(i => i.status === 'completed').length,
      inProgress: all.filter(i => i.status === 'in-progress').length,
      notStarted: all.filter(i => i.status === 'not-started').length,
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get interview stats' });
  }
});

// GET /api/interviews/:id?userId=xxx
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const [interview] = await db
      .select()
      .from(interviews)
      .where(and(eq(interviews.id, id), eq(interviews.userId, userId)));
    if (!interview) return res.status(404).json({ error: 'Interview not found' });
    res.json(interview);
  } catch (error) {
    console.error('Error getting interview by ID:', error);
    res.status(500).json({ error: 'Failed to get interview' });
  }
});

// POST /api/interviews
router.post('/', async (req, res) => {
  const { userId, jobPosition, jobDescription, experience } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const [created] = await db
      .insert(interviews)
      .values({
        id: uuidv4(),
        userId,
        jobPosition,
        jobDescription,
        experience,
        status: 'not-started',
        questions: [],
        answers: [],
        feedback: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        startedAt: null,
        completedAt: null,
      })
      .returning();
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating interview:', error);
    res.status(500).json({ error: 'Failed to create interview' });
  }
});

// PUT /api/interviews/:id  (generic update)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { userId, ...updates } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const [updated] = await db
      .update(interviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(interviews.id, id), eq(interviews.userId, userId)))
      .returning();
    if (!updated) return res.status(404).json({ error: 'Interview not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating interview:', error);
    res.status(500).json({ error: 'Failed to update interview' });
  }
});

// PUT /api/interviews/:id/questions
router.put('/:id/questions', async (req, res) => {
  const { id } = req.params;
  const { userId, questions } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const [updated] = await db
      .update(interviews)
      .set({ questions, status: 'ready', updatedAt: new Date() })
      .where(and(eq(interviews.id, id), eq(interviews.userId, userId)))
      .returning();
    if (!updated) return res.status(404).json({ error: 'Interview not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error updating questions:', error);
    res.status(500).json({ error: 'Failed to update interview questions' });
  }
});

// PUT /api/interviews/:id/complete
router.put('/:id/complete', async (req, res) => {
  const { id } = req.params;
  const { userId, answers, feedback } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const [updated] = await db
      .update(interviews)
      .set({ answers, feedback, status: 'completed', completedAt: new Date(), updatedAt: new Date() })
      .where(and(eq(interviews.id, id), eq(interviews.userId, userId)))
      .returning();
    if (!updated) return res.status(404).json({ error: 'Interview not found' });
    res.json(updated);
  } catch (error) {
    console.error('Error completing interview:', error);
    res.status(500).json({ error: 'Failed to complete interview' });
  }
});

// DELETE /api/interviews/:id?userId=xxx
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const [deleted] = await db
      .delete(interviews)
      .where(and(eq(interviews.id, id), eq(interviews.userId, userId)))
      .returning();
    if (!deleted) return res.status(404).json({ error: 'Interview not found' });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting interview:', error);
    res.status(500).json({ error: 'Failed to delete interview' });
  }
});

export default router;
