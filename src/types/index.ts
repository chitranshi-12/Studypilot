export type DiagramType = 'flow' | 'mindmap' | 'comparison' | 'barchart';

export interface FlowStep {
  step: number;
  title: string;
  description: string;
}

export interface MindMapBranch {
  title: string;
  subpoints: string[];
}

export interface ComparisonRow {
  feature: string;
  val1: string;
  val2: string;
}

export interface BarChartItem {
  label: string;
  value: number;
  note?: string;
}

export interface DiagramData {
  steps?: FlowStep[];
  center?: string;
  branches?: MindMapBranch[];
  columns?: [string, string];
  rows?: ComparisonRow[];
  chartTitle?: string;
  unit?: string;
  items?: BarChartItem[];
}

export interface TopicExplanation {
  topicId: string;
  simpleExplanation: string;
  diagramType: DiagramType;
  diagramData: DiagramData;
  realLifeExample: string;
  memoryTrick: string;
  generatedAt: string;
}

export interface Topic {
  id: string;
  title: string;
  bullets: string[];
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  relatedTopic?: string;
}

export interface TestAttempt {
  id: string;
  date: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  score: number;
  totalQuestions: number;
  percentage: number;
  missedQuestions?: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
  }[];
}

export interface StudyDocument {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  summary: string;
  extractedSnippet?: string;
  isTruncated?: boolean;
  topics: Topic[];
  keyTerms: KeyTerm[];
  examTips: string[];
  explanations?: Record<string, TopicExplanation>; // keyed by topicId or questionId
  testHistory?: TestAttempt[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  isDemo?: boolean;
}
