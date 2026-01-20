export interface StudyPlanInput {
  subjects: string[];
  examDate: string;
  hoursPerDay: number;
  weakSubjects: string[];
  stressLevel: 'low' | 'medium' | 'high';
}

export interface DailyPlan {
  day: string;
  tasks: string[];
  studyHours: number;
}

export interface StudyPlanResponse {
  overview: string;
  weeklyPlan: DailyPlan[];
  focusTips: string[];
  burnoutWarnings: string[];
  motivation: string;
}
