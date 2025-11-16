const API_BASE_URL = 'https://aadil-backend-production.up.railway.app/api';

export interface Transaction {
  id: number;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: 'expense' | 'income' | 'meal_swipe' | 'term_bill';
}

export interface TimelinePoint {
  date: string;
  balance: number;
  week: number;
  is_historical: boolean;
}

export interface SpendingBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  target_timeframe: string;
  current_amount: number;
  percentage: number;
  completed: boolean;
}

export interface InsightItem {
  id: string;
  title: string;
  content: string;
  type: 'warning' | 'tip' | 'achievement';
  category: string;
  date: string;
}

export interface DashboardData {
  current_balance: number;
  projected_balance: number;
  semester_end_date: string;
  semester_savings: number;
  on_track_status: string;
  last_30_days_breakdown: SpendingBreakdown[];
  active_goals: Goal[];
  recent_insights: InsightItem[];
}

export interface TimelineData {
  on_pace: TimelinePoint[];
  aadil_plan: TimelinePoint[];
  comparison_stats: {
    balance_difference: number;
    savings_potential: number;
    days_with_cushion: number;
    events_affordable: number;
  };
}

export interface SimulationState {
  current_date: string;
  semester_start: string;
  semester_end: string;
  current_balance: number;
  goals: Goal[];
}

export interface BudgetAllocation {
  category: string;
  weekly_limit: number;
  color: string;
  icon: string;
}

export interface BudgetSpending {
  category: string;
  spent: number;
  limit: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface BudgetSuggestion {
  category: string;
  suggestion: string;
  impact: string;
  type: 'increase' | 'decrease' | 'maintain';
}

export interface OptimizationTip {
  action: string;
  category: string;
  savings_per_week: number;
  icon: string;
}

export const api = {
  async getDashboard(): Promise<DashboardData> {
    const response = await fetch(`${API_BASE_URL}/dashboard`);
    if (!response.ok) throw new Error('Failed to fetch dashboard');
    return response.json();
  },

  async getTimeline(): Promise<TimelineData> {
    const response = await fetch(`${API_BASE_URL}/timeline`);
    if (!response.ok) throw new Error('Failed to fetch timeline');
    return response.json();
  },

  async getInsights(): Promise<InsightItem[]> {
    const response = await fetch(`${API_BASE_URL}/insights`);
    if (!response.ok) throw new Error('Failed to fetch insights');
    return response.json();
  },

  async getWeeklyReports(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/reports/weekly`);
    if (!response.ok) throw new Error('Failed to fetch weekly reports');
    return response.json();
  },

  async getSemesterReport(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/reports/semester`);
    if (!response.ok) throw new Error('Failed to fetch semester report');
    return response.json();
  },

  async simulateDay(): Promise<{
    message: string;
    new_date: string;
    new_transactions: Transaction[];
    new_balance: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/simulate-day`, {
      method: 'POST',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to simulate day');
    }
    return response.json();
  },

  async getState(): Promise<SimulationState> {
    const response = await fetch(`${API_BASE_URL}/state`);
    if (!response.ok) throw new Error('Failed to fetch state');
    return response.json();
  },

  async resetSimulation(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/reset`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to reset simulation');
    return response.json();
  },

  async createGoal(goal: Goal): Promise<{ message: string; goal: Goal }> {
    const response = await fetch(`${API_BASE_URL}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(goal),
    });
    if (!response.ok) throw new Error('Failed to create goal');
    return response.json();
  },

  async getGoals(): Promise<Goal[]> {
    const response = await fetch(`${API_BASE_URL}/goals`);
    if (!response.ok) throw new Error('Failed to fetch goals');
    return response.json();
  },

  async getRecentTransactions(limit: number = 10): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/transactions/recent?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  },

  async getBudgets(): Promise<BudgetAllocation[]> {
    const response = await fetch(`${API_BASE_URL}/budgets`);
    if (!response.ok) throw new Error('Failed to fetch budgets');
    return response.json();
  },

  async updateBudgets(budgets: BudgetAllocation[]): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/budgets`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(budgets),
    });
    if (!response.ok) throw new Error('Failed to update budgets');
    return response.json();
  },

  async getBudgetSpending(): Promise<BudgetSpending[]> {
    const response = await fetch(`${API_BASE_URL}/budgets/spending`);
    if (!response.ok) throw new Error('Failed to fetch budget spending');
    return response.json();
  },

  async getBudgetSuggestions(): Promise<BudgetSuggestion[]> {
    const response = await fetch(`${API_BASE_URL}/budgets/suggestions`);
    if (!response.ok) throw new Error('Failed to fetch budget suggestions');
    return response.json();
  },

  async getOptimizationTips(): Promise<OptimizationTip[]> {
    const response = await fetch(`${API_BASE_URL}/optimization-tips`);
    if (!response.ok) throw new Error('Failed to fetch optimization tips');
    return response.json();
  },

  async deleteGoal(goalId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete goal');
    return response.json();
  },

  async markGoalComplete(goalId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/goals/${goalId}/complete`, {
      method: 'PATCH',
    });
    if (!response.ok) throw new Error('Failed to mark goal as complete');
    return response.json();
  },
};

