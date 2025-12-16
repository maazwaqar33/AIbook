import React, { useState, useEffect } from 'react';
import styles from './ChapterActions.module.css';
import { getApiUrl, isBackendAvailable } from '../../config/api';

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

// API URL from centralized config (points to Hugging Face in production)
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

                // Create and insert notice with sleek styling
                const notice = document.createElement('div');
                notice.id = 'personalize-notice';
                notice.style.cssText = `
                  background: linear-gradient(135deg, #1a2e1a 0%, #162e16 50%, #0f4620 100%);
                  border: 1px solid rgba(0, 255, 136, 0.3);
                  border-radius: 16px;
                  padding: 24px;
                  margin-bottom: 24px;
                  color: #e0e0e0;
                  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1);
                  animation: slideIn 0.5s ease-out;
                `;

                // Add animation keyframes if not already added
                if (!document.getElementById('personalize-animation-styles')) {
                    const styleEl = document.createElement('style');
                    styleEl.id = 'personalize-animation-styles';
                    styleEl.textContent = `
                    @keyframes slideIn {
                      from { opacity: 0; transform: translateY(-20px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                  `;
                    document.head.appendChild(styleEl);
                }

                notice.innerHTML = `
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(0, 255, 136, 0.2);">
                    <span style="font-size: 1.5rem;">✨</span>
                    <span style="font-size: 1.25rem; font-weight: 600; color: #00ff88;">Personalized for ${user?.name || 'you'}</span>
                    <span style="background: rgba(0, 255, 136, 0.2); padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; color: #00ff88;">${user?.experienceLevel || 'beginner'}</span>
                  </div>
                  <div style="line-height: 1.8; font-size: 1rem; color: #f0f0f0; white-space: pre-wrap;">${personalizedContent}</div>
                  ${!isBackendAvailable() ? '<div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.85rem; color: #888;">📌 Demo mode - deploy to Vercel or run backend locally for full personalization</div>' : ''}
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

                // Create and insert Urdu notice with sleek styling
                const notice = document.createElement('div');
                notice.id = 'urdu-notice';
                notice.dir = 'rtl';
                notice.style.cssText = `
                  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                  border: 1px solid rgba(0, 212, 255, 0.3);
                  border-radius: 16px;
                  padding: 24px;
                  margin-bottom: 24px;
                  text-align: right;
                  font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif;
                  color: #e0e0e0;
                  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1);
                  animation: slideIn 0.5s ease-out;
                  position: relative;
                  overflow: hidden;
                `;

                // Add animation keyframes
                if (!document.getElementById('urdu-animation-styles')) {
                    const styleEl = document.createElement('style');
                    styleEl.id = 'urdu-animation-styles';
                    styleEl.textContent = `
                    @keyframes slideIn {
                      from { opacity: 0; transform: translateY(-20px); }
                      to { opacity: 1; transform: translateY(0); }
                    }
                    @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap');
                  `;
                    document.head.appendChild(styleEl);
                }

                notice.innerHTML = `
                  <div style="display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(0, 212, 255, 0.2);">
                    <span style="font-size: 1.25rem; font-weight: 600; color: #00d4ff;">اردو ترجمہ</span>
                    <span style="font-size: 1.5rem;">🌐</span>
                  </div>
                  <div style="line-height: 2.2; font-size: 1.1rem; color: #f0f0f0;">${translatedContent}</div>
                  ${!isBackendAvailable() ? '<div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.85rem; color: #888; direction: ltr; text-align: left;">📌 Demo mode - deploy to Vercel or run backend locally for full translation</div>' : ''}
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
