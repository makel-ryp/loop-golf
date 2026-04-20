import {
  doc,
  collection,
  setDoc,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseClient";

// ── Profile ────────────────────────────────────────────────────────────────

export type GolfGoal =
  | "play_first_round"
  | "break_100"
  | "break_90"
  | "play_with_others"
  | "get_handicap"
  | "join_league"
  | "just_for_fun";

export interface UserProfile {
  name: string;
  age: number;
  golfLevel: "beginner" | "intermediate" | "advanced";
  yearsExperience: number;
  handicap: number | null;
  projectedDrivingDistance: number | null;
  goals: GolfGoal[];
}

export const saveProfile = (userId: string, data: UserProfile) =>
  setDoc(
    doc(db, "users", userId, "profiles", "profile"),
    { ...data, updatedAt: serverTimestamp(), createdAt: serverTimestamp() },
    { merge: true }
  );

export const getProfile = async (userId: string): Promise<UserProfile | null> => {
  const { getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, "users", userId, "profiles", "profile"));
  return snap.exists() ? (snap.data() as UserProfile) : null;
};

// ── Metrics ────────────────────────────────────────────────────────────────

export interface ClubMetric {
  clubName: string;
  displayName: string;
  shots: number;
  carryDistance: number;    // yards (avg)
  avgOffline: number;       // yards negative=left positive=right
  avgMissYards: number;     // absolute lateral miss
  missDirection: 'left' | 'right' | 'straight';
  launchAngle: number;      // degrees (avg)
  ballSpeed: number;        // mph (avg)
  spinRate: number;         // rpm (avg)
}

export const saveMetrics = async (
  userId: string,
  uploadSessionId: string,
  metrics: ClubMetric[]
) => {
  const metricsCol = collection(db, "users", userId, "metrics");
  return Promise.all(
    metrics.map((m) =>
      addDoc(metricsCol, {
        ...m,
        uploadSessionId,
        uploadDate: serverTimestamp(),
        createdAt: serverTimestamp(),
      })
    )
  );
};

export const getLatestMetrics = async (userId: string): Promise<(ClubMetric & { id: string })[]> => {
  const q = query(
    collection(db, "users", userId, "metrics"),
    orderBy("uploadDate", "desc"),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ClubMetric & { id: string }));
};

// ── Readiness Score ────────────────────────────────────────────────────────

export interface ReadinessScore {
  overallScore: number;
  distanceReadiness: number;
  consistencyReadiness: number;
  knowledgeReadiness: number;
}

export const saveReadinessScore = (userId: string, score: ReadinessScore) =>
  addDoc(collection(db, "users", userId, "readinessScores"), {
    ...score,
    calculatedAt: serverTimestamp(),
  });

export const getLatestReadinessScore = async (
  userId: string
): Promise<(ReadinessScore & { id: string }) | null> => {
  const q = query(
    collection(db, "users", userId, "readinessScores"),
    orderBy("calculatedAt", "desc"),
    limit(1)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as ReadinessScore & { id: string };
};

// ── Courses (shared read-only collection) ──────────────────────────────────

export interface Course {
  id: string;
  name: string;
  lengthYards: number;
  handicap: number;
  par: number;
  location: string;
  description: string;
}

export const getAllCourses = async (): Promise<Course[]> => {
  const snap = await getDocs(collection(db, "courses"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Course));
};

// ── Recommendations ────────────────────────────────────────────────────────

export interface Recommendation {
  courseName: string;
  courseLengthYards: number;
  courseHandicap: number;
  status: "ready" | "stretch" | "not-yet";
  reason: string;
}

export const saveRecommendations = (userId: string, recs: Recommendation[]) =>
  Promise.all(
    recs.map((r) =>
      addDoc(collection(db, "users", userId, "recommendations"), {
        ...r,
        createdAt: serverTimestamp(),
      })
    )
  );

export const getLatestRecommendations = async (
  userId: string
): Promise<(Recommendation & { id: string })[]> => {
  const q = query(
    collection(db, "users", userId, "recommendations"),
    orderBy("createdAt", "desc"),
    limit(10)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Recommendation & { id: string }));
};

// ── Quiz Result ───────────────────────────────────────────────────────────

import type { AnswerKey } from "../data/quizQuestions";
import type { ActionTag } from "./quizScoring";

export interface QuizResult {
  golfIQ: number;
  rawPoints: number;
  maxPoints: number;
  answers: Record<number, AnswerKey>;
  actionTags: ActionTag[];
  categoryBreakdown: Record<string, number>;
}

export const saveQuizResult = (userId: string, result: QuizResult) =>
  setDoc(doc(db, "users", userId, "quizResults", "latest"), {
    ...result,
    completedAt: serverTimestamp(),
  });

export const getQuizResult = async (userId: string): Promise<QuizResult | null> => {
  const { getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, "users", userId, "quizResults", "latest"));
  return snap.exists() ? (snap.data() as QuizResult) : null;
};

// ── Session (single-call pipeline: summaries → Firestore) ─────────────────

import type { ClubSummary } from "./shotAnalyzer";

export interface SessionSummary {
  sessionId: string;
  sevenIronCarry: number | null;
  clubCount: number;
  uploadDate: { toDate?: () => Date } | null;
}

export const getSessions = async (userId: string): Promise<SessionSummary[]> => {
  const q = query(
    collection(db, "users", userId, "sessions"),
    orderBy("uploadDate", "desc"),
    limit(20)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as SessionSummary);
};

export const saveSession = async (
  userId: string,
  summaries: ClubSummary[],
  sevenIronCarry: number | null
): Promise<string> => {
  const sessionId = `session_${Date.now()}`;
  const metricsCol = collection(db, "users", userId, "metrics");

  await Promise.all(
    summaries.map((s) =>
      addDoc(metricsCol, {
        clubName:      s.club,
        displayName:   s.displayName,
        shots:         s.shots,
        carryDistance: s.avgCarry,
        avgOffline:    s.avgOffline,
        avgMissYards:  s.avgMissYards,
        missDirection: s.missDirection,
        launchAngle:   s.avgLaunchAngle,
        ballSpeed:     s.avgBallSpeed,
        spinRate:      s.avgSpinRate,
        uploadSessionId: sessionId,
        uploadDate:    serverTimestamp(),
        createdAt:     serverTimestamp(),
      })
    )
  );

  // Store the session summary doc for quick dashboard reads
  await setDoc(doc(db, "users", userId, "sessions", sessionId), {
    sessionId,
    sevenIronCarry,
    clubCount: summaries.length,
    uploadDate: serverTimestamp(),
  });

  return sessionId;
};
