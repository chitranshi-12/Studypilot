import React, { useState } from 'react';
import { StudyDocument, TestQuestion, TestAttempt, TopicExplanation } from '../types';
import { generateTest, explainTopic } from '../services/geminiClient';
import { ExplanationCard } from './ExplanationCard';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  Sparkles,
  Loader2,
  Brain,
  History,
  AlertTriangle,
  Lightbulb,
  Check,
  X
} from 'lucide-react';

interface TestSessionProps {
  document: StudyDocument;
  onUpdateDocument: (updated: StudyDocument) => void;
}

export const TestSession: React.FC<TestSessionProps> = ({ document, onUpdateDocument }) => {
  const [sessionState, setSessionState] = useState<'setup' | 'loading' | 'active' | 'results'>('setup');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [qIndex: number]: number }>({});
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingExplanation, setLoadingExplanation] = useState<string | null>(null);

  // Start test generation
  const handleStartTest = async () => {
    try {
      setSessionState('loading');
      setErrorMessage(null);
      const generated = await generateTest({
        documentTitle: document.title,
        documentSummary: document.summary,
        topics: document.topics,
        keyTerms: document.keyTerms,
        questionCount,
        difficulty,
      });

      if (!generated || generated.length === 0) {
        throw new Error('No questions could be generated from the document.');
      }

      setQuestions(generated);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setUserAnswers({});
      setSessionState('active');
    } catch (err: any) {
      console.error('Test generation error:', err);
      setErrorMessage(err.message || 'Failed to generate test session with Gemini.');
      setSessionState('setup');
    }
  };

  // Option selection
  const handleSelectOption = (optIndex: number) => {
    if (isAnswerRevealed) return; // already answered
    setSelectedOption(optIndex);
    setIsAnswerRevealed(true);
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }));
  };

  // Next question or finish
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      finishTest();
    }
  };

  // Finish test & record score
  const finishTest = () => {
    let correctCount = 0;
    const missedList: NonNullable<TestAttempt['missedQuestions']> = [];

    questions.forEach((q, idx) => {
      const userChoice = userAnswers[idx];
      if (userChoice === q.correctIndex) {
        correctCount += 1;
      } else {
        missedList.push({
          question: q.question,
          userAnswer: userChoice !== undefined ? q.options[userChoice] || 'No answer' : 'Skipped',
          correctAnswer: q.options[q.correctIndex],
          explanation: q.explanation,
        });
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);

    const newAttempt: TestAttempt = {
      id: 'att_' + Date.now().toString(36),
      date: new Date().toISOString(),
      difficulty,
      score: correctCount,
      totalQuestions: questions.length,
      percentage,
      missedQuestions: missedList,
    };

    const updatedHistory = [newAttempt, ...(document.testHistory || [])];
    const updatedDoc: StudyDocument = {
      ...document,
      testHistory: updatedHistory,
      updatedAt: new Date().toISOString(),
    };

    onUpdateDocument(updatedDoc);
    setSessionState('results');

    // Trigger celebration confetti if score is >= 70%
    if (percentage >= 70) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  // Explain missed question on demand
  const handleExplainQuestion = async (qKey: string, question: string, wrongAns: string, rightAns: string) => {
    try {
      setLoadingExplanation(qKey);
      const explanation = await explainTopic({
        questionText: question,
        wrongAnswer: wrongAns,
        correctAnswer: rightAns,
        documentContext: document.summary,
      });

      const updatedExplanations = {
        ...(document.explanations || {}),
        [qKey]: explanation,
      };

      const updatedDoc = {
        ...document,
        explanations: updatedExplanations,
      };
      onUpdateDocument(updatedDoc);
    } catch (e) {
      console.error('Failed to explain missed question:', e);
    } finally {
      setLoadingExplanation(null);
    }
  };

  // SETUP SCREEN
  if (sessionState === 'setup') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto py-4">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-50 to-violet-50 dark:from-indigo-950 dark:to-violet-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto shadow-xs">
            <Brain className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Adaptive Exam Practice
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Test yourself against targeted multiple-choice questions created by Gemini strictly from this document.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
            {errorMessage}
          </div>
        )}

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-5">
          {/* Question Count Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Number of Questions
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setQuestionCount(num)}
                  className={`py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                    questionCount === num
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/20'
                      : 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {num} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
              Target Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Easy', 'Medium', 'Hard'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`py-2.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
                    difficulty === lvl
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20 ring-2 ring-violet-500/20'
                      : 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartTest}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Generate & Start Test Session</span>
          </button>
        </div>

        {/* Previous Attempt History */}
        {document.testHistory && document.testHistory.length > 0 && (
          <div className="p-5 rounded-3xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              <History className="w-4 h-4" />
              <span>Past Attempt History ({document.testHistory.length})</span>
            </div>

            <div className="divide-y divide-slate-200/60 dark:divide-slate-800">
              {document.testHistory.slice(0, 5).map((attempt, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Score: {attempt.score} / {attempt.totalQuestions} ({attempt.percentage}%)
                    </span>
                    <p className="text-[11px] text-slate-400">
                      {new Date(attempt.date).toLocaleString()} • {attempt.difficulty} Level
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    attempt.percentage >= 70
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                  }`}>
                    {attempt.percentage >= 70 ? 'Passed' : 'Needs Review'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // LOADING SCREEN
  if (sessionState === 'loading') {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mx-auto">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Building Your Exam Simulation…
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Gemini is formulating {questionCount} {difficulty}-level questions strictly based on your document.
          </p>
        </div>
      </div>
    );
  }

  // RESULTS SCREEN
  if (sessionState === 'results') {
    const currentAttempt = document.testHistory?.[0];
    const score = currentAttempt?.score ?? 0;
    const total = currentAttempt?.totalQuestions ?? questions.length;
    const pct = currentAttempt?.percentage ?? 0;

    let motivation = 'Terrific job! You demonstrated strong mastery of this material.';
    if (pct < 50) {
      motivation = 'Good effort! Review the missed questions and their memory diagrams below to reinforce the concepts.';
    } else if (pct < 75) {
      motivation = 'Solid performance! A quick review of the tricky questions will push you into top-percentile marks.';
    } else if (pct >= 90) {
      motivation = 'Outstanding mastery! You are well-prepared for any exam on this topic.';
    }

    const missed = currentAttempt?.missedQuestions || [];

    return (
      <div className="space-y-6 max-w-2xl mx-auto py-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Award className="w-8 h-8" />
          </div>

          <div>
            <span className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {pct}%
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
              {score} out of {total} questions correct
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium max-w-md mx-auto leading-relaxed">
            {motivation}
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setSessionState('setup')}
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Take Another Test</span>
            </button>
          </div>
        </div>

        {/* Missed Questions Review */}
        {missed.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Review Missed Questions ({missed.length})</span>
              </h3>
              <span className="text-xs text-slate-400">With AI Visual Diagnostics</span>
            </div>

            <div className="space-y-3">
              {missed.map((item, idx) => {
                const qKey = `missed_${item.question.slice(0, 30)}`;
                const savedExp = document.explanations?.[qKey];

                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
                  >
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                      {idx + 1}. {item.question}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 flex items-start gap-2">
                        <X className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                        <div>
                          <span className="font-bold block text-[10px] uppercase text-rose-600 dark:text-rose-400">Your Answer:</span>
                          <span>{item.userAnswer}</span>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                        <Check className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                        <div>
                          <span className="font-bold block text-[10px] uppercase text-emerald-600 dark:text-emerald-400">Correct Answer:</span>
                          <span>{item.correctAnswer}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Explanation: </span>
                      {item.explanation}
                    </p>

                    {/* Explain with diagram and example for this wrong question */}
                    <ExplanationCard
                      explanation={savedExp}
                      topicTitle={`Exam Review: ${item.question.slice(0, 40)}…`}
                      isLoading={loadingExplanation === qKey}
                      onGenerate={() =>
                        handleExplainQuestion(qKey, item.question, item.userAnswer, item.correctAnswer)
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ACTIVE TEST SESSION
  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-500 dark:text-slate-400">
            Question <span className="text-indigo-600 dark:text-indigo-400 font-bold">{currentIndex + 1}</span> of {questions.length}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            {difficulty}
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="space-y-2">
          {currentQ.relatedTopic && (
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              {currentQ.relatedTopic}
            </span>
          )}
          <h3 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        {/* 4 Options */}
        <div className="space-y-2.5">
          {currentQ.options.map((opt, optIdx) => {
            let optionStyles = 'border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-900';

            if (isAnswerRevealed) {
              if (optIdx === currentQ.correctIndex) {
                // Correct option
                optionStyles = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20';
              } else if (optIdx === selectedOption) {
                // Selected wrong option
                optionStyles = 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20';
              } else {
                optionStyles = 'opacity-40 border-slate-200 dark:border-slate-800';
              }
            }

            return (
              <button
                key={optIdx}
                disabled={isAnswerRevealed}
                onClick={() => handleSelectOption(optIdx)}
                className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${optionStyles}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-xs flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span>{opt}</span>
                </div>

                {isAnswerRevealed && optIdx === currentQ.correctIndex && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 ml-2" />
                )}
                {isAnswerRevealed && optIdx === selectedOption && optIdx !== currentQ.correctIndex && (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Revealed feedback & explanation */}
        {isAnswerRevealed && (
          <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
            <div className={`p-4 rounded-2xl ${
              selectedOption === currentQ.correctIndex
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200'
            }`}>
              <div className="flex items-center gap-2 font-bold text-xs mb-1">
                {selectedOption === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Correct! Excellent recall.</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-600" />
                    <span>Incorrect. Review the rationale below:</span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {currentQ.explanation}
              </p>
            </div>

            {/* Explain with diagram if wrongly answered */}
            {selectedOption !== currentQ.correctIndex && (
              <ExplanationCard
                explanation={document.explanations?.[`q_${currentQ.id}`]}
                topicTitle={`Concept Breakdown: ${currentQ.question.slice(0, 45)}…`}
                isLoading={loadingExplanation === `q_${currentQ.id}`}
                onGenerate={() =>
                  handleExplainQuestion(
                    `q_${currentQ.id}`,
                    currentQ.question,
                    selectedOption !== null ? currentQ.options[selectedOption] : 'None',
                    currentQ.options[currentQ.correctIndex]
                  )
                }
              />
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Test Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
