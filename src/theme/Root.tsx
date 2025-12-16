import React, { ReactNode, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import ChatbotWidget from '../components/ChatbotWidget';
import NavbarAuthButton from '../components/NavbarAuthButton';
import { getApiUrl } from '../config/api';

/*
  Swizzled Root component - adds global components to every page:
  1. ChatbotWidget - RAG-powered chatbot in bottom right
  2. NavbarAuthButton - Auth button in navbar (via React Portal)
*/

interface RootProps {
    children: ReactNode;
}

export default function Root({ children }: RootProps): React.JSX.Element {
    const [navbarContainer, setNavbarContainer] = useState<HTMLElement | null>(null);
    const [apiUrl, setApiUrl] = useState('http://localhost:8000');

    // Get API URL on client side
    useEffect(() => {
        setApiUrl(getApiUrl());
    }, []);

    // Find navbar container for portal
    useEffect(() => {
        const findNavbar = () => {
            const navbar = document.querySelector('.navbar__items--right');
            if (navbar && !document.getElementById('navbar-auth-container')) {
                const container = document.createElement('div');
                container.id = 'navbar-auth-container';
                container.style.marginLeft = '8px';
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                navbar.appendChild(container);
                setNavbarContainer(container);
            }
        };

        // Try multiple times for SPA navigation
        findNavbar();
        const timer1 = setTimeout(findNavbar, 100);
        const timer2 = setTimeout(findNavbar, 500);
        const timer3 = setTimeout(findNavbar, 1000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    return (
        <>
            {children}
            <ChatbotWidget apiUrl={apiUrl} />
            {navbarContainer && createPortal(<NavbarAuthButton />, navbarContainer)}
        </>
    );
}
