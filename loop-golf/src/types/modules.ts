export type QuestionType = 'MC' | 'TF';

export type QuestionTag =
  | 'COURSE'
  | 'SCORING'
  | 'RULES'
  | 'ETIQUETTE'
  | 'EQUIPMENT'
  | 'SWING'
  | 'MINDSET';

export interface Question {
  id: string;           // e.g. "m1-q1"
  n: number;
  type: QuestionType;
  tag: QuestionTag;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  memoryHook: string;
}

export interface Module {
  id: string;           // e.g. "module-1"
  number: number;
  title: string;
  subtitle: string;
  color: string;        // hex
  lightColor: string;   // hex
  passingScore: number; // out of 10
  totalQuestions: number;
  intro: string;
  questions: Question[];
}

export interface QuizResult {
  moduleId: string;
  score: number;
  total: number;
  passed: boolean;
  answers: Record<string, string>; // questionId -> selected answer
  completedAt: Date;
}

export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  passed: boolean;
  bestScore: number;
  attempts: number;
  lastAttemptAt?: Date;
}
