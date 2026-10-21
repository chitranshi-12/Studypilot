import React, { useState } from 'react';
import { StudyDocument } from '../types';
import { exportNotesToPdf } from '../services/pdfExport';
import { explainTopic } from '../services/geminiClient';
import { ExplanationCard } from './ExplanationCard';
import { TestSession } from './TestSession';
import {
  ArrowLeft,
  FileText,
  Copy,
  Check,
  Download,
  Lightbulb,
  Sparkles,
  BookOpen,
  Award,
  Zap,
  Info,
  Layers,
  HelpCircle
} from 'lucide-react';

interface DocumentDetailProps {
  document: StudyDocument;
  initialTab?: 'notes' | 'test';
  onBack: () => void;
  onUpdateDocument: (updated: StudyDocument) => void;
}

export const DocumentDetail: React.FC<DocumentDetailProps> = ({
  document,
  initialTab = 'notes',
  onBack,
  onUpdateDocument,
}) => {
  const [activeTab, setActiveTab] = useState<'notes' | 'test'>(initialTab);
  const [copied, setCopied] = useState(false);
  const [loadingTopicId, setLoadingTopicId] = useState<string | null>(null);

  // Copy notes as Markdown
  const handleCopyNotes = () => {
    let md = `# ${document.title}\n\n`;
    md += `**Summary:** ${document.summary}\n\n`;

    if (document.examTips && document.examTips.length > 0) {
      md += `## High-Yield Exam Tips\n`;
      document.examTips.forEach((tip) => {
        md += `- ⚡ ${tip}\n`;
      });
      md += `\n`;
    }

    md += `## Key Topics\n`;
    document.topics.forEach((topic) => {
      md += `### ${topic.title}\n`;
      topic.bullets.forEach((b) => {
        md += `- ${b}\n`;
      });
      md += `\n`;
    });

    if (document.keyTerms && document.keyTerms.length > 0) {
      md += `## Key Vocabulary Terms\n`;
      document.keyTerms.forEach((kt) => {
        md += `- **${kt.term}:** ${kt.definition}\n`;
      });
    }

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Download PDF
  const handleDownloadPdf = () => {
    exportNotesToPdf(document);
  };

  // Explain topic with diagram & example
  const handleExplainTopic = async (topicId: string, topicTitle: string, bullets: string[]) => {
    try {
      setLoadingTopicId(topicId);
      const explanation = await explainTopic({
        topicTitle,
        topicBullets: bullets,
        documentContext: document.summary,
      });

      const updatedExplanations = {
        ...(document.explanations || {}),
        [topicId]: explanation,
      };

      const updatedDoc = {
        ...document,
        explanations: updatedExplanations,
        updatedAt: new Date().toISOString(),
      };

      onUpdateDocument(updatedDoc);
    } catch (e) {
      console.error('Failed to generate topic explanation:', e);
    } finally {
      setLoadingTopicId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-slate-600 dark:text-slate-400"
            title="Back to library"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                PDF Guide
              </span>
              <span className="text-xs text-slate-400 truncate max-w-xs">{document.fileName}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              {document.title}
            </h1>
          </div>
        </div>

        {/* Action Buttons: Copy Notes & Download PDF */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyNotes}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Notes</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPdf}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Truncated Alert if huge PDF */}
      {document.isTruncated && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
          <Info className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            <strong>Note:</strong> Due to the large size of this PDF, StudyPilot focused on analyzing the highest-yield primary chapters and key concepts.
          </span>
        </div>
      )}

      {/* Main Tabs: Notes vs Test */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 relative cursor-pointer transition-colors flex items-center gap-2 ${
            activeTab === 'notes'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Short Notes & Diagrams</span>
          {activeTab === 'notes' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('test')}
          className={`pb-3 relative cursor-pointer transition-colors flex items-center gap-2 ${
            activeTab === 'test'
              ? 'text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Practice Test Session</span>
          {document.testHistory && document.testHistory.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
              {document.testHistory.length}
            </span>
          )}
          {activeTab === 'test' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full" />
          )}
        </button>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'notes' ? (
        <div className="space-y-8 animate-fadeIn">
          {/* Executive Summary Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/40 via-white to-violet-50/40 dark:from-indigo-950/30 dark:via-slate-900 dark:to-violet-950/20 border border-indigo-100/80 dark:border-indigo-950/60 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Executive Summary</span>
            </div>
            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
              {document.summary}
            </p>
          </div>

          {/* High-Yield Exam Tips Callout */}
          {document.examTips && document.examTips.length > 0 && (
            <div className="p-6 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>High-Yield Exam Tips & Pitfalls ({document.examTips.length})</span>
              </div>
              <ul className="space-y-2">
                {document.examTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                    <span className="font-bold text-amber-500 shrink-0">✦</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Topics & Micro-Bullets */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                  Core Topics ({document.topics.length})
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Micro-bullets &lt;25 words</span>
            </div>

            <div className="space-y-4">
              {document.topics.map((topic, idx) => {
                const savedExp = document.explanations?.[topic.id];

                return (
                  <div
                    key={topic.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {topic.title}
                        </h3>
                      </div>
                    </div>

                    {/* Micro bullets under 25 words */}
                    <ul className="space-y-2 pl-2 sm:pl-3 border-l-2 border-slate-100 dark:border-slate-800">
                      {topic.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2">
                          <span className="text-indigo-500 select-none">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Explain with diagram and example button & card */}
                    <ExplanationCard
                      explanation={savedExp}
                      topicTitle={topic.title}
                      isLoading={loadingTopicId === topic.id}
                      onGenerate={() =>
                        handleExplainTopic(topic.id, topic.title, topic.bullets)
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Vocabulary Terms */}
          {document.keyTerms && document.keyTerms.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                  Key Vocabulary Terms ({document.keyTerms.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {document.keyTerms.map((term, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-indigo-700 dark:text-indigo-300">
                        {term.term}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {term.definition}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Test Session Tab */
        <div className="animate-fadeIn">
          <TestSession
            document={document}
            onUpdateDocument={onUpdateDocument}
          />
        </div>
      )}
    </div>
  );
};
