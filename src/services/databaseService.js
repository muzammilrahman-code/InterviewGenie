import { db, interviews } from '../db/index.js';
import { eq, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

class DatabaseService {
  // Get all interviews for current user
  async getInterviews(userId) {
    try {
      const userInterviews = await db
        .select()
        .from(interviews)
        .where(eq(interviews.userId, userId))
        .orderBy(interviews.createdAt);
      
      return userInterviews;
    } catch (error) {
      console.error('Error getting interviews:', error);
      return [];
    }
  }

  // Create new interview
  async createInterview(userId, interviewData) {
    try {
      const newInterview = {
        id: uuidv4(),
        userId,
        jobPosition: interviewData.jobPosition,
        jobDescription: interviewData.jobDescription,
        experience: interviewData.experience,
        status: 'not-started',
        questions: [],
        answers: [],
        feedback: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        startedAt: null,
        completedAt: null
      };

      const [createdInterview] = await db
        .insert(interviews)
        .values(newInterview)
        .returning();
      
      return createdInterview;
    } catch (error) {
      console.error('Error creating interview:', error);
      throw new Error('Failed to create interview');
    }
  }

  // Get interview by ID
  async getInterviewById(interviewId, userId) {
    try {
      const [interview] = await db
        .select()
        .from(interviews)
        .where(and(eq(interviews.id, interviewId), eq(interviews.userId, userId)));
      
      return interview || null;
    } catch (error) {
      console.error('Error getting interview by ID:', error);
      return null;
    }
  }

  // Update interview
  async updateInterview(interviewId, userId, updates) {
    try {
      const [updatedInterview] = await db
        .update(interviews)
        .set({
          ...updates,
          updatedAt: new Date()
        })
        .where(and(eq(interviews.id, interviewId), eq(interviews.userId, userId)))
        .returning();
      
      if (!updatedInterview) {
        throw new Error('Interview not found');
      }
      
      return updatedInterview;
    } catch (error) {
      console.error('Error updating interview:', error);
      throw new Error('Failed to update interview');
    }
  }

  // Update interview with questions
  async updateInterviewWithQuestions(interviewId, userId, questions) {
    return this.updateInterview(interviewId, userId, {
      questions,
      status: 'ready'
    });
  }

  // Update interview with answers and feedback
  async completeInterview(interviewId, userId, answers, feedback) {
    return this.updateInterview(interviewId, userId, {
      answers,
      feedback,
      status: 'completed',
      completedAt: new Date()
    });
  }

  // Delete interview
  async deleteInterview(interviewId, userId) {
    try {
      const [deletedInterview] = await db
        .delete(interviews)
        .where(and(eq(interviews.id, interviewId), eq(interviews.userId, userId)))
        .returning();
      
      return !!deletedInterview;
    } catch (error) {
      console.error('Error deleting interview:', error);
      return false;
    }
  }

  // Get interview statistics
  async getInterviewStats(userId) {
    try {
      const userInterviews = await this.getInterviews(userId);
      
      return {
        total: userInterviews.length,
        completed: userInterviews.filter(i => i.status === 'completed').length,
        inProgress: userInterviews.filter(i => i.status === 'in-progress').length,
        notStarted: userInterviews.filter(i => i.status === 'not-started').length
      };
    } catch (error) {
      console.error('Error getting interview stats:', error);
      return { total: 0, completed: 0, inProgress: 0, notStarted: 0 };
    }
  }
}

export default new DatabaseService();