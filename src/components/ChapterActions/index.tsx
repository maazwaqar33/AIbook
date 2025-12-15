import React, { useState, useEffect } from 'react';
import styles from './ChapterActions.module.css';

/*
  This component provides the Personalize and Translate buttons 
  that appear at the top of each chapter. It connects to my 
  FastAPI backend for translation and personalization.
  
  If the user is logged in, personalization uses their profile.
  Otherwise, defaults to beginner level.
*/

interface UserProfile {
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
    softwareBackground: string;
    hardwareBackground: string;
    programmingLanguages: string[];
    interests: string[];
}

interface ChapterActionsProps {
    className?: string;
}

const API_URL = 'http://localhost:8000';

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
                // Get content text (first 2000 chars for demo)
                const contentText = contentEl.textContent?.slice(0, 2000) || '';

                // Use user profile if logged in, otherwise default to beginner
                const requestBody = {
                    content: contentText,
                    experience_level: user?.experienceLevel || 'beginner',
                    background: user?.softwareBackground || 'other',
                    interests: user?.interests || ['robotics', 'ai'],
                    preferred_examples: user?.programmingLanguages?.includes('Python') ? 'python' :
                        user?.programmingLanguages?.includes('C++') ? 'cpp' : 'python'
                };

                const response = await fetch(`${API_URL}/api/personalize`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                if (!response.ok) {
                    throw new Error('Backend not running. Start with: uvicorn main:app --reload');
                }

                const data = await response.json();

                // Create and insert notice
                const notice = document.createElement('div');
                notice.id = 'personalize-notice';
                notice.className = 'alert alert--info margin-bottom--md';

                const levelLabel = user?.experienceLevel ?
                    `for ${user.experienceLevel}s` :
                    'for beginners (sign in for personalized content)';

                notice.innerHTML = `<strong>✨ Personalized ${levelLabel}:</strong><br/><div style="margin-top:8px;">${data.personalized_content.slice(0, 800)}...</div>`;

                const firstChild = contentEl.querySelector('h1, h2, p');
                if (firstChild) {
                    firstChild.parentNode?.insertBefore(notice, firstChild.nextSibling);
                } else {
                    contentEl.insertBefore(notice, contentEl.firstChild);
                }

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
                // Get content text (first 1500 chars for demo)
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
                    throw new Error('Backend not running. Start with: uvicorn main:app --reload');
                }

                const data = await response.json();

                // Create and insert Urdu notice
                const notice = document.createElement('div');
                notice.id = 'urdu-notice';
                notice.className = 'alert alert--success margin-bottom--md';
                notice.dir = 'rtl';
                notice.style.textAlign = 'right';
                notice.style.fontFamily = 'Noto Nastaliq Urdu, serif';
                notice.innerHTML = `<strong>🌐 اردو ترجمہ:</strong><br/><div style="margin-top:8px;line-height:2;">${data.translated_content}</div>`;

                const firstChild = contentEl.querySelector('h1, h2, p');
                if (firstChild) {
                    firstChild.parentNode?.insertBefore(notice, firstChild.nextSibling);
                } else {
                    contentEl.insertBefore(notice, contentEl.firstChild);
                }

                setIsUrdu(true);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error connecting to backend');
            console.error('Translation error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`${styles.chapterActions} ${className || ''}`}>
            <button
                className={`${styles.actionButton} ${isPersonalized ? styles.active : ''}`}
                onClick={handlePersonalize}
                disabled={isLoading}
                title={user ? `Personalize for ${user.experienceLevel} level` : 'Personalize content (sign in for best results)'}
            >
                <span className={styles.icon}>✨</span>
                {isPersonalized ? 'Reset Content' : 'Personalize for Me'}
            </button>

            <button
                className={`${styles.actionButton} ${isUrdu ? styles.active : ''}`}
                onClick={handleTranslate}
                disabled={isLoading}
                title="Translate content to Urdu"
            >
                <span className={styles.icon}>🌐</span>
                {isUrdu ? 'Show English' : 'اردو میں پڑھیں'}
            </button>

            {isLoading && (
                <span className={styles.loadingIndicator}>
                    ⏳ Processing...
                </span>
            )}

            {error && (
                <span style={{ color: '#e74c3c', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                    ⚠️ {error}
                </span>
            )}
        </div>
    );
}
