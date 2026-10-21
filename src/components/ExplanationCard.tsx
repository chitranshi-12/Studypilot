import React, { useState } from 'react';
import { TopicExplanation } from '../types';
import { DiagramRenderer } from './diagrams/DiagramRenderer';
import { Lightbulb, Sparkles, BookOpen, Brain, Loader2, ChevronDown, ChevronUp } from 'lucide-react';

interface ExplanationCardProps {
  explanation?: TopicExplanation;
  onGenerate: () => Promise<void>;
  isLoading?: boolean;
  topicTitle?: string;
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({
  explanation,
  onGenerate,
  isLoading = false,
  topicTitle,
}) => {
  const [isOpen, setIsOpen] = useState(Boolean(explanation));

  if (!explanation) {
    return (
      <div className="pt-2">
        <button
          onClick={async () => {
            setIsOpen(true);
            await onGenerate();
          }}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/80 transition-all cursor-pointer shadow-xs disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600 dark:text-indigo-400" />
              <span>Analyzing diagram & concept…</span>
            </>
          ) : (
            <>
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>💡 Explain with diagram & example</span>
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-2xl border border-indigo-100 dark:border-indigo-950/70 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 dark:from-indigo-950/30 dark:via-slate-900/60 dark:to-slate-900/40 p-4 shadow-sm transition-all">
      <div className="flex items-center justify-between pb-2 border-b border-indigo-100 dark:border-indigo-950">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Lightbulb className="w-4 h-4 fill-amber-500" />
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-300">
              Visual Intuition & Worked Example
            </h4>
            {topicTitle && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{topicTitle}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          title={isOpen ? 'Collapse' : 'Expand'}
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 space-y-4">
          {/* Simple Explanation */}
          <div>
            <p className="text-sm font-medium leading-relaxed text-slate-800 dark:text-slate-200">
              {explanation.simpleExplanation}
            </p>
          </div>

          {/* Rendered Diagram */}
          {explanation.diagramData && (
            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60">
              <DiagramRenderer
                type={explanation.diagramType}
                data={explanation.diagramData}
              />
            </div>
          )}

          {/* Real-Life Worked Example */}
          <div className="p-3.5 rounded-xl border border-blue-100 dark:border-blue-950/60 bg-blue-50/40 dark:bg-blue-950/20 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Real-Life Worked Example</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {explanation.realLifeExample}
            </p>
          </div>

          {/* Memory Trick / Analogy */}
          <div className="p-3.5 rounded-xl border border-amber-100 dark:border-amber-950/60 bg-amber-50/40 dark:bg-amber-950/20 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 mb-1">
              <Brain className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Memory Trick & Mnemonic</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {explanation.memoryTrick}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
