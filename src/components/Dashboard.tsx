import React from 'react';
import { StudyDocument, UserProfile } from '../types';
import { UploadSection } from './UploadSection';
import {
  FileText,
  CheckCircle,
  TrendingUp,
  Award,
  ArrowRight,
  Clock,
  Sparkles,
  HelpCircle,
  Trash2
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  documents: StudyDocument[];
  onOpenDocument: (docId: string, initialTab?: 'notes' | 'test') => void;
  onDocumentCreated: (doc: StudyDocument) => void;
  onDeleteDocument: (docId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  documents,
  onOpenDocument,
  onDocumentCreated,
  onDeleteDocument,
}) => {
  // Compute stats across all documents
  const totalDocuments = documents.length;
  
  let totalTestsTaken = 0;
  let totalScoreSum = 0;
  let bestScore = 0;

  documents.forEach((doc) => {
    if (doc.testHistory && doc.testHistory.length > 0) {
      doc.testHistory.forEach((att) => {
        totalTestsTaken += 1;
        totalScoreSum += att.percentage;
        if (att.percentage > bestScore) {
          bestScore = att.percentage;
        }
      });
    }
  });

  const averageScore = totalTestsTaken > 0 ? Math.round(totalScoreSum / totalTestsTaken) : 0;

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>StudyPilot AI Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.displayName.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl font-normal leading-relaxed">
            Ready to convert your lecture PDFs into high-yield exam summaries, visual memory diagrams, and practice test sessions?
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-2 relative z-10 bg-white/10 p-3 rounded-2xl border border-white/10 backdrop-blur-sm">
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-wider text-indigo-200 font-bold">Current Target</p>
            <p className="text-sm font-bold">Exam Mastery 100%</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-sm">
            A*
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Documents</span>
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalDocuments}
            </span>
            <span className="text-xs text-slate-400">analyzed</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Tests Taken</span>
            <span className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
              <CheckCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {totalTestsTaken}
            </span>
            <span className="text-xs text-slate-400">sessions</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Score</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {averageScore}%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">accuracy</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Best Score</span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Award className="w-4 h-4" />
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {bestScore}%
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">personal peak</span>
          </div>
        </div>
      </div>

      {/* PDF Upload Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Upload & Analyze New PDF
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Scanned & Digital PDFs Supported
          </span>
        </div>
        <UploadSection userId={user.uid} onDocumentCreated={onDocumentCreated} />
      </div>

      {/* Recent Documents */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Recent Study Materials
          </h2>
          <span className="text-xs text-slate-400">
            {documents.length} document{documents.length === 1 ? '' : 's'} in library
          </span>
        </div>

        {documents.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No documents analyzed yet
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Upload your first PDF or select one of our pre-loaded guides above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.slice(0, 6).map((doc) => {
              const lastTest = doc.testHistory && doc.testHistory.length > 0 ? doc.testHistory[0] : null;

              return (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                        {doc.topics.length} topics • {doc.keyTerms.length} terms
                      </span>
                      {lastTest ? (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          lastTest.percentage >= 70
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        }`}>
                          Score: {lastTest.percentage}%
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-mono">
                          No test taken
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {doc.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenDocument(doc.id, 'notes')}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                      >
                        Notes
                      </button>
                      <button
                        onClick={() => onOpenDocument(doc.id, 'test')}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-violet-600 text-white hover:bg-violet-700 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Test</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
