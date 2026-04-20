import type { Module, Question, QuizResult, ModuleProgress } from '../types/modules';

/**
 * Checks whether a given answer is correct for a question.
 */
export const isCorrect = (question: Question, selectedAnswer: string): boolean =>
  question.correctAnswer === selectedAnswer;

/**
 * Calculates the result of a completed quiz attempt.
 */
export const calculateResult = (
  module: Module,
  answers: Record<string, string>
): QuizResult => {
  const score = module.questions.reduce((count, question) => {
    const selected = answers[question.id];
    return selected && isCorrect(question, selected) ? count + 1 : count;
  }, 0);

  return {
    moduleId: module.id,
    score,
    total: module.totalQuestions,
    passed: score >= module.passingScore,
    answers,
    completedAt: new Date(),
  };
};

/**
 * Returns percentage score rounded to nearest integer.
 */
export const getScorePercent = (score: number, total: number): number =>
  Math.round((score / total) * 100);

/**
 * Returns a motivational message based on score.
 */
export const getResultMessage = (result: QuizResult): string => {
  const pct = getScorePercent(result.score, result.total);
  if (pct === 100) return "Perfect score. You know this module cold.";
  if (pct >= 90) return "Excellent. One or two edge cases to review.";
  if (result.passed) return "You passed. Solid understanding — keep building.";
  if (pct >= 50) return "Getting there. Review the explanations and try again.";
  return "Keep studying. Every question has a memory hook — use them.";
};

/**
 * Returns which questions were answered incorrectly.
 */
export const getMissedQuestions = (
  module: Module,
  answers: Record<string, string>
): Question[] =>
  module.questions.filter((q) => {
    const selected = answers[q.id];
    return !selected || !isCorrect(q, selected);
  });

/**
 * Updates module progress after a quiz attempt.
 */
export const updateProgress = (
  existing: ModuleProgress | undefined,
  result: QuizResult
): ModuleProgress => ({
  moduleId: result.moduleId,
  completed: true,
  passed: result.passed || (existing?.passed ?? false),
  bestScore: Math.max(result.score, existing?.bestScore ?? 0),
  attempts: (existing?.attempts ?? 0) + 1,
  lastAttemptAt: result.completedAt,
});

/**
 * Shuffles an array (for randomising answer options).
 * Does not mutate the original.
 */
export const shuffle = <T>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
