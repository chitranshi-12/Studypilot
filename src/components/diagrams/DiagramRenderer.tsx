import React from 'react';
import { DiagramType, DiagramData } from '../../types';
import { ArrowRight, Sparkles, Network, GitCompare, BarChart3, CheckCircle2 } from 'lucide-react';

interface DiagramRendererProps {
  type: DiagramType;
  data: DiagramData;
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({ type, data }) => {
  if (type === 'flow' && data.steps && data.steps.length > 0) {
    return (
      <div className="space-y-4 my-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <ArrowRight className="w-4 h-4" />
          <span>Sequential Process Flow</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                    {step.step || idx + 1}
                  </span>
                  {idx < data.steps!.length - 1 && (
                    <span className="text-xs text-slate-400 hidden lg:inline-flex items-center gap-1 font-mono">
                      next <ArrowRight className="w-3 h-3 text-indigo-400" />
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'mindmap' && data.branches && data.branches.length > 0) {
    return (
      <div className="my-4 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
          <Network className="w-4 h-4" />
          <span>Concept Mind Map</span>
        </div>

        {/* Center Node */}
        <div className="flex justify-center">
          <div className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-700 text-white font-bold text-sm shadow-md text-center max-w-md ring-4 ring-indigo-500/10">
            {data.center || 'Core Concept'}
          </div>
        </div>

        {/* Radiating Branches */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {data.branches.map((branch, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-violet-100 dark:border-violet-950/60 bg-violet-50/40 dark:bg-violet-950/20 shadow-xs"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                <h4 className="font-semibold text-sm text-violet-900 dark:text-violet-300">
                  {branch.title}
                </h4>
              </div>
              <ul className="space-y-1.5 pl-4 border-l border-violet-200 dark:border-violet-800">
                {branch.subpoints.map((sub, sIdx) => (
                  <li key={sIdx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                    <span className="text-violet-400 select-none">•</span>
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'comparison' && data.rows && data.rows.length > 0) {
    const colA = data.columns?.[0] || 'Entity A';
    const colB = data.columns?.[1] || 'Entity B';

    return (
      <div className="my-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          <GitCompare className="w-4 h-4" />
          <span>Comparative Matrix</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <th className="py-2.5 px-3 font-semibold w-1/3">Key Dimension</th>
                <th className="py-2.5 px-3 font-semibold text-indigo-700 dark:text-indigo-400">{colA}</th>
                <th className="py-2.5 px-3 font-semibold text-violet-700 dark:text-violet-400">{colB}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {data.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-900/30">
                    {row.feature}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {row.val1}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">
                    {row.val2}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (type === 'barchart' && data.items && data.items.length > 0) {
    const maxValue = Math.max(...data.items.map((i) => i.value || 0), 1);

    return (
      <div className="my-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            {data.chartTitle || 'Quantitative Breakdown'}
          </span>
          {data.unit && (
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] font-normal">
              Unit: {data.unit}
            </span>
          )}
        </div>

        <div className="space-y-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          {data.items.map((item, idx) => {
            const percent = Math.min(100, Math.round(((item.value || 0) / maxValue) * 100));
            return (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
                  <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                    {item.value} {data.unit || ''}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {item.note && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pl-1">
                    {item.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};
