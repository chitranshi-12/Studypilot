/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, StudyDocument } from './types';
import {
  getCurrentStoredUser,
  fetchUserDocuments,
  saveUserDocument,
  deleteUserDocument,
  logoutUser,
  auth
} from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { MobileHeader } from './components/MobileHeader';
import { Dashboard } from './components/Dashboard';
import { Library } from './components/Library';
import { UploadSection } from './components/UploadSection';
import { DocumentDetail } from './components/DocumentDetail';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => getCurrentStoredUser());
  const [documents, setDocuments] = useState<StudyDocument[]>([]);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'library' | 'upload'>('dashboard');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [docInitialTab, setDocInitialTab] = useState<'notes' | 'test'>('notes');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('studypilot_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('studypilot_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('studypilot_theme', 'light');
    }
  }, [isDark]);

  // Auth listener for Firebase and LocalStorage events
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const profile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || 'user@example.com',
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Scholar',
            photoURL: fbUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fbUser.displayName || 'SP')}`,
            isDemo: false,
          };
          localStorage.setItem('studypilot_auth_user_v1', JSON.stringify(profile));
          setUser(profile);
        } else {
          const stored = getCurrentStoredUser();
          if (!stored || !stored.isDemo) {
            localStorage.removeItem('studypilot_auth_user_v1');
            setUser(null);
          }
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // Listen to custom auth events
  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getCurrentStoredUser());
    };
    window.addEventListener('studypilot_auth_changed', handleAuthChange);
    return () => window.removeEventListener('studypilot_auth_changed', handleAuthChange);
  }, []);

  // Load documents when user changes
  useEffect(() => {
    if (user) {
      loadDocuments(user.uid);
    }
  }, [user]);

  // Reactive listener for local documents update
  useEffect(() => {
    const handleDocsUpdate = () => {
      if (user) {
        loadDocuments(user.uid);
      }
    };
    window.addEventListener('studypilot_docs_updated', handleDocsUpdate);
    return () => window.removeEventListener('studypilot_docs_updated', handleDocsUpdate);
  }, [user]);

  const loadDocuments = async (uid: string) => {
    try {
      const docs = await fetchUserDocuments(uid);
      setDocuments(docs);
    } catch (e) {
      console.error('Error loading documents:', e);
    }
  };

  const handleDocumentCreated = async (newDoc: StudyDocument) => {
    await saveUserDocument(newDoc);
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocId(newDoc.id);
    setDocInitialTab('notes');
  };

  const handleUpdateDocument = async (updatedDoc: StudyDocument) => {
    await saveUserDocument(updatedDoc);
    setDocuments((prev) =>
      prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d))
    );
  };

  const handleDeleteDocument = async (docId: string) => {
    if (user) {
      await deleteUserDocument(docId, user.uid);
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
      if (selectedDocId === docId) {
        setSelectedDocId(null);
      }
    }
  };

  const handleOpenDocument = (docId: string, initialTab: 'notes' | 'test' = 'notes') => {
    setSelectedDocId(docId);
    setDocInitialTab(initialTab);
  };

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    setSelectedDocId(null);
    setCurrentTab('dashboard');
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // If not logged in, render the landing/login page
  if (!user) {
    return <LandingPage onLoginSuccess={(u) => setUser(u)} isDark={isDark} toggleTheme={toggleTheme} />;
  }

  const selectedDocument = documents.find((d) => d.id === selectedDocId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors">
      {/* Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setSelectedDocId(null);
          setCurrentTab(tab);
        }}
        user={user}
        onLogout={handleLogout}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenDoc={handleOpenDocument}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        {/* Mobile Header Bar */}
        <MobileHeader
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            setSelectedDocId(null);
            setCurrentTab(tab);
          }}
          user={user}
          onLogout={handleLogout}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />

        <main className="flex-1 pb-16">
          {selectedDocument ? (
            <DocumentDetail
              document={selectedDocument}
              initialTab={docInitialTab}
              onBack={() => setSelectedDocId(null)}
              onUpdateDocument={handleUpdateDocument}
            />
          ) : currentTab === 'dashboard' ? (
            <Dashboard
              user={user}
              documents={documents}
              onOpenDocument={handleOpenDocument}
              onDocumentCreated={handleDocumentCreated}
              onDeleteDocument={handleDeleteDocument}
            />
          ) : currentTab === 'library' ? (
            <Library
              documents={documents}
              onOpenDocument={handleOpenDocument}
              onDeleteDocument={handleDeleteDocument}
              onNavigateUpload={() => setCurrentTab('upload')}
            />
          ) : (
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Upload & Analyze PDF
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Provide any textbook chapter, notes, or scanned handout to begin
                </p>
              </div>
              <UploadSection
                userId={user.uid}
                onDocumentCreated={handleDocumentCreated}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
