import React, { useState, useEffect } from 'react';
import styles from './ChapterActions.module.css';

/*
  This component provides the Personalize and Translate buttons.
  
  For GitHub Pages (static hosting), it uses DEMO MODE with simulated
  responses since there's no backend. For local development with
  the FastAPI backend running, it uses the real API.
*/

interface UserProfile {
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    softwareBackground: string;
    hardwareBackground: string;
    programmingLanguages: string[];
    interests: string[];
    name?: string;
}

interface ChapterActionsProps {
    className?: string;
}

// Check if we're on localhost (backend available) or deployed (demo mode)
const getApiUrl = (): string => {
    if (typeof window === 'undefined') return '';
    const hostname = window.location.hostname;
    // Vercel deployment - use relative API path
    if (hostname.includes('vercel.app')) return '';
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:8000';
    // GitHub Pages - demo mode
    return '';
};

const isBackendAvailable = (): boolean => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('vercel.app');
};

const API_URL = getApiUrl();

export default function ChapterActions({ className }: ChapterActionsProps): React.JSX.Element {
    const [isPersonalized, setIsPersonalized] = useState(false);
    const [isUrdu, setIsUrdu] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserProfile | null>(null);

    // Load user profile on mount
    useEffect(() => {
        const stored = localStorage.getItem('ai_textbook_user');
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to parse user');
            }
        }
    }, []);

    // Get the main content element
    const getContentElement = (): Element | null => {
        return document.querySelector('article.markdown') ||
            document.querySelector('.theme-doc-markdown') ||
            document.querySelector('main');
    };

    // Demo personalization (for GitHub Pages without backend)
    const getDemoPersonalizedContent = (original: string): string => {
        const level = user?.experienceLevel || 'beginner';
        const name = user?.name || 'learner';

        const levelIntros: Record<string, string> = {
            beginner: `👋 Hi ${name}! Here's a simplified explanation tailored for beginners:\n\nThis chapter covers foundational concepts in robotics and AI. Don't worry if some terms seem complex - we'll explain everything step by step. Think of robots as machines that can sense their environment, make decisions, and take actions.`,
            intermediate: `Welcome back, ${name}! Here's the content adapted for intermediate learners:\n\nBuilding on your existing knowledge, this chapter dives deeper into the technical aspects. You'll see how concepts like control loops, sensor fusion, and motion planning work together in real robotic systems.`,
            advanced: `Greetings, ${name}. Advanced perspective:\n\nThis section presents cutting-edge research and implementation details. We'll examine the mathematical foundations, optimization techniques, and system integration challenges that define modern Physical AI systems.`
        };

        return levelIntros[level] || levelIntros.beginner;
    };

    // Demo translation (for GitHub Pages without backend)
    const getDemoUrduContent = (): string => {
        return `🌐 اردو ترجمہ (ڈیمو موڈ)

یہ فزیکل اے آئی اور ہیومنائیڈ روبوٹکس کی نصابی کتاب ہے۔

روبوٹکس کیا ہے؟
روبوٹکس ایک سائنس ہے جو روبوٹ بنانے اور چلانے سے متعلق ہے۔ روبوٹ ایسی مشینیں ہیں جو خود بخود کام کر سکتی ہیں۔

اہم نکات:
• سینسرز - ماحول کو سمجھنے کے لیے
• ایکچویٹرز - حرکت کے لیے
• کنٹرول سسٹمز - فیصلے کرنے کے لیے
• مصنوعی ذہانت - سیکھنے کے لیے

نوٹ: مکمل ترجمے کے لیے بیک اینڈ سرور چلائیں۔`;
    };

    const handlePersonalize = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const contentEl = getContentElement();
            if (!contentEl) {
                setError('Could not find content');
                return;
            }

            if (isPersonalized) {
                // Remove personalization notice
                const notice = document.getElementById('personalize-notice');
                if (notice) notice.remove();
                setIsPersonalized(false);
            } else {
                let personalizedContent: string;

                if (isBackendAvailable()) {
                    // Try real backend
                    try {
                        const contentText = contentEl.textContent?.slice(0, 2000) || '';
                        const response = await fetch(`${API_URL}/api/personalize`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                content: contentText,
                                experience_level: user?.experienceLevel || 'beginner',
                                background: user?.softwareBackground || 'other',
                                interests: user?.interests || ['robotics', 'ai'],
                                preferred_examples: user?.programmingLanguages?.includes('Python') ? 'python' : 'python'
                            })
                        });

                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({}));
                            throw new Error(errorData.detail || 'Backend error');
                        }

                        const data = await response.json();
                        personalizedContent = data.personalized_content;
                    } catch (err) {
                        // Fall back to demo mode
                        console.log('Backend unavailable, using demo mode');
                        personalizedContent = getDemoPersonalizedContent(contentEl.textContent?.slice(0, 500) || '');
                    }
                } else {
                    // Demo mode for GitHub Pages
                    personalizedContent = getDemoPersonalizedContent(contentEl.textContent?.slice(0, 500) || '');
                }

                // Create and insert notice
                const notice = document.createElement('div');
                notice.id = 'personalize-notice';
                notice.className = 'alert alert--info margin-bottom--md';
                notice.innerHTML = `
          <strong>✨ Personalized for ${user?.name || 'you'} (${user?.experienceLevel || 'beginner'} level)</strong>
          <p style="margin-top: 8px; white-space: pre-wrap;">${personalizedContent}</p>
          ${!isBackendAvailable() ? '<small style="color: #666;">📌 Demo mode - run backend locally for full personalization</small>' : ''}
        `;

                contentEl.insertBefore(notice, contentEl.firstChild);
                setIsPersonalized(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error connecting to backend');
            console.error('Personalization error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTranslate = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const contentEl = getContentElement();
            if (!contentEl) {
                setError('Could not find content');
                return;
            }

            if (isUrdu) {
                // Remove translation notice
                const notice = document.getElementById('urdu-notice');
                if (notice) notice.remove();
                document.body.classList.remove('rtl-mode');
                setIsUrdu(false);
            } else {
                let translatedContent: string;

                if (isBackendAvailable()) {
                    // Try real backend
                    try {
                        const contentText = contentEl.textContent?.slice(0, 1500) || '';
                        const response = await fetch(`${API_URL}/api/translate`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                content: contentText,
                                target_language: 'urdu'
                            })
                        });

                        if (!response.ok) {
                            const errorData = await response.json().catch(() => ({}));
                            throw new Error(errorData.detail || 'Backend error');
                        }

                        const data = await response.json();
                        translatedContent = data.translated_content;
                    } catch (err) {
                        // Fall back to demo mode
                        console.log('Backend unavailable, using demo mode');
                        translatedContent = getDemoUrduContent();
                    }
                } else {
                    // Demo mode for GitHub Pages
                    translatedContent = getDemoUrduContent();
                }

                // Create and insert Urdu notice
                const notice = document.createElement('div');
                notice.id = 'urdu-notice';
                notice.className = 'alert alert--success margin-bottom--md';
                notice.dir = 'rtl';
                notice.style.textAlign = 'right';
                notice.style.fontFamily = 'Noto Nastaliq Urdu, serif';
                notice.innerHTML = `
          <strong>🌐 اردو ترجمہ</strong>
          <div style="margin-top: 8px; white-space: pre-wrap; line-height: 2;">${translatedContent}</div>
          ${!isBackendAvailable() ? '<small style="color: #666; direction: ltr;">📌 Demo mode - run backend locally for full translation</small>' : ''}
        `;

                contentEl.insertBefore(notice, contentEl.firstChild);
                document.body.classList.add('rtl-mode');
                setIsUrdu(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error');
            console.error('Translation error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`${styles.container} ${className || ''}`}>
            <div className={styles.buttonGroup}>
                <button
                    onClick={handlePersonalize}
                    disabled={isLoading}
                    className={`${styles.button} ${isPersonalized ? styles.active : ''}`}
                >
                    {isLoading && !isUrdu ? (
                        <span className={styles.loading}>⏳</span>
                    ) : (
                        <>
                            <span className={styles.icon}>✨</span>
                            {isPersonalized ? 'Show Original' : 'Personalize for Me'}
                        </>
                    )}
                </button>

                <button
                    onClick={handleTranslate}
                    disabled={isLoading}
                    className={`${styles.button} ${styles.urduButton} ${isUrdu ? styles.active : ''}`}
                >
                    {isLoading && isUrdu ? (
                        <span className={styles.loading}>⏳</span>
                    ) : (
                        <>
                            <span className={styles.icon}>🌐</span>
                            {isUrdu ? 'English' : 'اردو'}
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className={styles.error}>
                    ⚠️ {error}
                </div>
            )}

            {!isBackendAvailable() && (
                <div className={styles.demoNote}>
                    📌 Demo mode active - for full features, run backend locally
                </div>
            )}
        </div>
    );
}
