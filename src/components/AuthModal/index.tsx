import React, { useState, useEffect } from 'react';
import styles from './AuthModal.module.css';

/*
  Auth Modal - Signup and Signin modal with user background questions.
  At signup, I ask about software/hardware background to enable
  personalized content later.
*/

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (user: any) => void;
}

type AuthMode = 'signin' | 'signup' | 'questions';

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps): React.JSX.Element | null {
    const [mode, setMode] = useState<AuthMode>('signin');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    // Background questions
    const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
    const [softwareBackground, setSoftwareBackground] = useState('');
    const [hardwareBackground, setHardwareBackground] = useState('');
    const [programmingLanguages, setProgrammingLanguages] = useState<string[]>([]);
    const [interests, setInterests] = useState<string[]>([]);

    // Reset modal state when opened
    useEffect(() => {
        if (isOpen) {
            setMode('signin');
            setError(null);
            setEmail('');
            setPassword('');
            setName('');
            setExperienceLevel('beginner');
            setSoftwareBackground('');
            setHardwareBackground('');
            setProgrammingLanguages([]);
            setInterests([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSignin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Check localStorage for existing user
            const stored = localStorage.getItem('ai_textbook_user');
            if (stored) {
                const user = JSON.parse(stored);
                if (user.email === email) {
                    onSuccess(user);
                    onClose();
                    return;
                }
            }
            setError('No account found. Please sign up first.');
        } catch (err) {
            setError('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignupNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password || !name) {
            setError('Please fill in all fields');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }
        setError(null);
        setMode('questions');
    };

    const handleCompleteSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const user = {
                id: crypto.randomUUID(),
                email,
                name,
                experienceLevel,
                softwareBackground,
                hardwareBackground,
                programmingLanguages,
                interests,
            };

            localStorage.setItem('ai_textbook_user', JSON.stringify(user));
            onSuccess(user);
            onClose();
        } catch (err) {
            setError('Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLanguage = (lang: string) => {
        setProgrammingLanguages(prev =>
            prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
        );
    };

    const toggleInterest = (interest: string) => {
        setInterests(prev =>
            prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
        );
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>✕</button>

                {mode === 'signin' && (
                    <>
                        <h2 className={styles.title}>Welcome Back</h2>
                        <p className={styles.subtitle}>Sign in to access personalized content</p>

                        <form onSubmit={handleSignin} className={styles.form}>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className={styles.input}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className={styles.input}
                                required
                            />

                            {error && <p className={styles.error}>{error}</p>}

                            <button type="submit" className={styles.submitButton} disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </button>
                        </form>

                        <p className={styles.switchMode}>
                            Don't have an account?{' '}
                            <button onClick={() => setMode('signup')} className={styles.linkButton}>
                                Sign Up
                            </button>
                        </p>
                    </>
                )}

                {mode === 'signup' && (
                    <>
                        <h2 className={styles.title}>Create Account</h2>
                        <p className={styles.subtitle}>Join to get personalized learning</p>

                        <form onSubmit={handleSignupNext} className={styles.form}>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className={styles.input}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className={styles.input}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password (min 8 characters)"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className={styles.input}
                                required
                            />

                            {error && <p className={styles.error}>{error}</p>}

                            <button type="submit" className={styles.submitButton}>
                                Next: Tell Us About You
                            </button>
                        </form>

                        <p className={styles.switchMode}>
                            Already have an account?{' '}
                            <button onClick={() => setMode('signin')} className={styles.linkButton}>
                                Sign In
                            </button>
                        </p>
                    </>
                )}

                {mode === 'questions' && (
                    <>
                        <h2 className={styles.title}>About Your Background</h2>
                        <p className={styles.subtitle}>This helps us personalize content for you</p>

                        <form onSubmit={handleCompleteSignup} className={styles.form}>
                            {/* Experience Level */}
                            <div className={styles.questionGroup}>
                                <label className={styles.label}>Your Experience Level</label>
                                <div className={styles.optionGroup}>
                                    {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                                        <button
                                            key={level}
                                            type="button"
                                            className={`${styles.optionButton} ${experienceLevel === level ? styles.selected : ''}`}
                                            onClick={() => setExperienceLevel(level)}
                                        >
                                            {level.charAt(0).toUpperCase() + level.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Software Background */}
                            <div className={styles.questionGroup}>
                                <label className={styles.label}>Software Background</label>
                                <select
                                    value={softwareBackground}
                                    onChange={e => setSoftwareBackground(e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="">Select your background...</option>
                                    <option value="none">No programming experience</option>
                                    <option value="student">CS/Engineering Student</option>
                                    <option value="webdev">Web Developer</option>
                                    <option value="data">Data Scientist</option>
                                    <option value="ml">ML/AI Engineer</option>
                                    <option value="systems">Systems/Embedded Developer</option>
                                    <option value="other">Other Technical Role</option>
                                </select>
                            </div>

                            {/* Hardware Background */}
                            <div className={styles.questionGroup}>
                                <label className={styles.label}>Hardware Experience</label>
                                <select
                                    value={hardwareBackground}
                                    onChange={e => setHardwareBackground(e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="">Select your experience...</option>
                                    <option value="none">No hardware experience</option>
                                    <option value="arduino">Arduino/Hobby Electronics</option>
                                    <option value="raspi">Raspberry Pi Projects</option>
                                    <option value="robotics">Robotics (hobby)</option>
                                    <option value="professional">Professional Robotics</option>
                                    <option value="mechanical">Mechanical Engineering</option>
                                    <option value="electrical">Electrical Engineering</option>
                                </select>
                            </div>

                            {/* Programming Languages */}
                            <div className={styles.questionGroup}>
                                <label className={styles.label}>Languages You Know</label>
                                <div className={styles.chipGroup}>
                                    {['Python', 'C++', 'JavaScript', 'C', 'MATLAB', 'ROS', 'None yet'].map(lang => (
                                        <button
                                            key={lang}
                                            type="button"
                                            className={`${styles.chip} ${programmingLanguages.includes(lang) ? styles.selected : ''}`}
                                            onClick={() => toggleLanguage(lang)}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Interests */}
                            <div className={styles.questionGroup}>
                                <label className={styles.label}>What interests you most?</label>
                                <div className={styles.chipGroup}>
                                    {['AI/ML', 'Robotics Hardware', 'Computer Vision', 'Control Systems', 'Humanoids', 'Drones', 'Autonomous Vehicles'].map(interest => (
                                        <button
                                            key={interest}
                                            type="button"
                                            className={`${styles.chip} ${interests.includes(interest) ? styles.selected : ''}`}
                                            onClick={() => toggleInterest(interest)}
                                        >
                                            {interest}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && <p className={styles.error}>{error}</p>}

                            <button type="submit" className={styles.submitButton} disabled={isLoading}>
                                {isLoading ? 'Creating Account...' : 'Complete Signup'}
                            </button>
                        </form>

                        <button onClick={() => setMode('signup')} className={styles.backButton}>
                            ← Back
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
