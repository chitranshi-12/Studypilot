import React, { useState, useRef } from 'react';
import { analyzePdf } from '../services/geminiClient';
import { StudyDocument } from '../types';
import { SAMPLE_DOCUMENTS } from '../services/sampleData';
import {
  UploadCloud,
  FileText,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

interface UploadSectionProps {
  userId: string;
  onDocumentCreated: (doc: StudyDocument) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ userId, onDocumentCreated }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (selectedFile: File) => {
    if (!selectedFile.type.includes('pdf') && !selectedFile.name.endsWith('.pdf')) {
      setErrorMessage('Please select a valid PDF document (scanned or digital).');
      return;
    }

    if (selectedFile.size > 25 * 1024 * 1024) {
      setErrorMessage('File exceeds 25MB limit. Please upload a smaller chapter or section.');
      return;
    }

    setFile(selectedFile);
    setErrorMessage(null);

    try {
      setLoadingStep('Reading your PDF file…');
      // Convert to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = (err) => reject(err);
      });
      reader.readAsDataURL(selectedFile);
      const pdfBase64 = await base64Promise;

      setLoadingStep('Sending to Gemini AI for deep document analysis…');
      // Short delay for UI fluidity
      await new Promise((r) => setTimeout(r, 600));

      setLoadingStep('Extracting high-yield topics, definitions & exam tips…');
      const analysis = await analyzePdf(pdfBase64, selectedFile.name);

      setLoadingStep('Finalizing your StudyPilot revision guide…');

      const newDoc: StudyDocument = {
        id: 'doc_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        userId: userId,
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        title: analysis.title || selectedFile.name.replace(/\.pdf$/i, ''),
        summary: analysis.summary || 'Summary of course material.',
        isTruncated: Boolean(analysis.isTruncated),
        topics: analysis.topics || [],
        keyTerms: analysis.keyTerms || [],
        examTips: analysis.examTips || [],
        explanations: {},
        testHistory: [],
      };

      onDocumentCreated(newDoc);
    } catch (err: any) {
      console.error('PDF upload & processing error:', err);
      setErrorMessage(
        err.message || 'Failed to analyze PDF. Please check your network and try again.'
      );
    } finally {
      setLoadingStep(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleSelect = (sample: StudyDocument) => {
    const cloned: StudyDocument = {
      ...sample,
      id: 'doc_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onDocumentCreated(cloned);
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !loadingStep && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 ring-4 ring-indigo-500/10'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm'
        } ${loadingStep ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              processFile(e.target.files[0]);
            }
          }}
        />

        {loadingStep ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
              </div>
              <Sparkles className="w-4 h-4 text-amber-500 absolute -top-1 -right-1 animate-bounce" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {loadingStep}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Gemini 3.8 Flash is reviewing text, formulas, diagrams, and scanned pages...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-50 to-violet-50 dark:from-indigo-950/60 dark:to-violet-950/60 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                Drop your study PDF here, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Supports lecture slides, textbook chapters, class handouts, and scanned PDFs (up to 25MB)
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 text-[11px] font-medium text-slate-400">
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                Native PDF input with Gemini AI
              </span>
              <span>•</span>
              <span>Instant Notes & Diagrams</span>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-start gap-3 text-xs text-rose-800 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <div>
            <p className="font-semibold">Analysis Failed</p>
            <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Pre-Loaded Academic Sample Guides */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-slate-50/60 dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-slate-900/40 border border-indigo-100 dark:border-indigo-950/60">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Don't have a PDF right now? Try these pre-analyzed guides:
            </h3>
          </div>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hidden sm:inline">
            1-Click Instant Test
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_DOCUMENTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSampleSelect(sample)}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 text-left transition-all group shadow-xs cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                    Sample Guide
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {sample.topics.length} topics • {sample.keyTerms.length} terms
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {sample.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {sample.summary}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Open & practice test</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
