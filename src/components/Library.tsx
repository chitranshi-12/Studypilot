import React, { useState } from 'react';
import { StudyDocument } from '../types';
import {
  Search,
  FileText,
  Clock,
  Trash2,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Filter,
  Sparkles,
  Award
} from 'lucide-react';

interface LibraryProps {
  documents: StudyDocument[];
  onOpenDocument: (docId: string, initialTab?: 'notes' | 'test') => void;
  onDeleteDocument: (docId: string) => void;
  onNavigateUpload: () => void;
}

export const Library: React.FC<LibraryProps> = ({
  documents,
  onOpenDocument,
  onDeleteDocument,
  onNavigateUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'tested' | 'untested'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const hasTests = doc.testHistory && doc.testHistory.length > 0;
    if (filterMode === 'tested') return matchesSearch && hasTests;
    if (filterMode === 'untested') return matchesSearch && !hasTests;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-6 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Study Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access all analyzed course PDFs, generated notes, and test records
          </p>
        </div>

        <button
          onClick={onNavigateUpload}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Upload Another PDF</span>
        </button>
      </div>

      {/* Controls: Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by document title, keywords, or filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-stretch sm:self-auto">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({documents.length})
          </button>
          <button
            onClick={() => setFilterMode('tested')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterMode === 'tested'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Tested
          </button>
          <button
            onClick={() => setFilterMode('untested')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterMode === 'untested'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Untested
          </button>
        </div>
      </div>

      {/* Document Grid */}
      {filteredDocs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
          <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No study guides match your criteria
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or upload a new PDF to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const lastTest = doc.testHistory && doc.testHistory.length > 0 ? doc.testHistory[0] : null;
            const highestTest = doc.testHistory?.reduce((max, cur) => cur.percentage > max ? cur.percentage : max, 0) || 0;

            return (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                      {doc.topics.length} topics • {doc.keyTerms.length} terms
                    </span>

                    {lastTest ? (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        lastTest.percentage >= 70
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}>
                        Last: {lastTest.percentage}%
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">
                        Not tested yet
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 line-clamp-1">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {doc.summary}
                  </p>
                  
                  {highestTest > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      <Award className="w-3.5 h-3.5" />
                      <span>Best score: {highestTest}%</span>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeleteConfirmId(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] text-slate-400">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenDocument(doc.id, 'notes')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                    >
                      Notes
                    </button>
                    <button
                      onClick={() => onOpenDocument(doc.id, 'test')}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors cursor-pointer flex items-center gap-1"
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Delete Study Guide?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                This will permanently remove this document, along with all saved explanations and test session scores.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="py-2 px-3 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteDocument(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="py-2 px-3 text-xs font-semibold rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
