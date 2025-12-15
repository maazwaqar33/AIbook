import React, { useState, useEffect } from 'react';
import styles from './NavbarAuthButton.module.css';
import AuthModal from '../AuthModal';

/*
  Navbar Auth Button - Shows login/signup or user info in the navbar.
  Uses localStorage for demo persistence.
*/

interface UserProfile {
    name: string;
    email: string;
    experienceLevel: string;
}

export default function NavbarAuthButton(): React.JSX.Element {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);

    // Check for existing user on mount
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

    const handleAuthSuccess = (userData: UserProfile) => {
        setUser(userData);
        setIsModalOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('ai_textbook_user');
        setUser(null);
    };

    return (
        <>
            {user ? (
                <div className={styles.userInfo}>
                    <span className={styles.userName}>
                        👤 {user.name}
                    </span>
                    <span className={styles.userLevel}>
                        ({user.experienceLevel})
                    </span>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                        Logout
                    </button>
                </div>
            ) : (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className={styles.authButton}
                >
                    🔐 Sign In
                </button>
            )}

            <AuthModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleAuthSuccess}
            />
        </>
    );
}
