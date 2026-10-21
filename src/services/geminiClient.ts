import { KeyTerm, Topic, TopicExplanation, TestQuestion } from '../types';

export interface AnalyzePdfResponse {
  title: string;
  summary: string;
  isTruncated: boolean;
  topics: Topic[];
  keyTerms: KeyTerm[];
  examTips: string[];
}

export async function analyzePdf(pdfBase64: string, fileName: string): Promise<AnalyzePdfResponse> {
  const response = await fetch('/api/analyze-pdf', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pdfBase64, fileName }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function explainTopic(params: {
  topicTitle?: string;
  topicBullets?: string[];
  documentContext?: string;
  questionText?: string;
  wrongAnswer?: string;
  correctAnswer?: string;
}): Promise<TopicExplanation> {
  const response = await fetch('/api/explain-topic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  const data = await response.json();
  return {
    topicId: params.topicTitle || params.questionText || 'explanation',
    simpleExplanation: data.simpleExplanation,
    diagramType: data.diagramType,
    diagramData: data.diagramData || {},
    realLifeExample: data.realLifeExample,
    memoryTrick: data.memoryTrick,
    generatedAt: new Date().toISOString(),
  };
}

export async function generateTest(params: {
  documentTitle: string;
  documentSummary: string;
  topics: Topic[];
  keyTerms: KeyTerm[];
  questionCount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}): Promise<TestQuestion[]> {
  const response = await fetch('/api/generate-test', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  const data = await response.json();
  return data.questions || [];
}
