const BASE = '/api/interviews';

class DatabaseService {
  async getInterviews(userId) {
    try {
      const res = await fetch(`${BASE}?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to get interviews');
      return await res.json();
    } catch (error) {
      console.error('Error getting interviews:', error);
      return [];
    }
  }

  async createInterview(userId, interviewData) {
    try {
      const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...interviewData }),
      });
      if (!res.ok) throw new Error('Failed to create interview');
      return await res.json();
    } catch (error) {
      console.error('Error creating interview:', error);
      throw new Error('Failed to create interview');
    }
  }

  async getInterviewById(interviewId, userId) {
    try {
      const res = await fetch(`${BASE}/${interviewId}?userId=${userId}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (error) {
      console.error('Error getting interview by ID:', error);
      return null;
    }
  }

  async updateInterview(interviewId, userId, updates) {
    try {
      const res = await fetch(`${BASE}/${interviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...updates }),
      });
      if (!res.ok) throw new Error('Interview not found');
      return await res.json();
    } catch (error) {
      console.error('Error updating interview:', error);
      throw new Error('Failed to update interview');
    }
  }

  async updateInterviewWithQuestions(interviewId, userId, questions) {
    try {
      const res = await fetch(`${BASE}/${interviewId}/questions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, questions }),
      });
      if (!res.ok) throw new Error('Interview not found');
      return await res.json();
    } catch (error) {
      console.error('Error updating interview questions:', error);
      throw new Error('Failed to update interview questions');
    }
  }

  async completeInterview(interviewId, userId, answers, feedback) {
    try {
      const res = await fetch(`${BASE}/${interviewId}/complete`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, answers, feedback }),
      });
      if (!res.ok) throw new Error('Interview not found');
      return await res.json();
    } catch (error) {
      console.error('Error completing interview:', error);
      throw new Error('Failed to complete interview');
    }
  }

  async deleteInterview(interviewId, userId) {
    try {
      const res = await fetch(`${BASE}/${interviewId}?userId=${userId}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (error) {
      console.error('Error deleting interview:', error);
      return false;
    }
  }

  async getInterviewStats(userId) {
    try {
      const res = await fetch(`${BASE}/stats?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to get stats');
      return await res.json();
    } catch (error) {
      console.error('Error getting interview stats:', error);
      return { total: 0, completed: 0, inProgress: 0, notStarted: 0 };
    }
  }
}

export default new DatabaseService();