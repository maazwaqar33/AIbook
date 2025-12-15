import React, { ReactNode } from 'react';
import ChatbotWidget from '../components/ChatbotWidget';
import NavbarAuthButton from '../components/NavbarAuthButton';

/*
  Swizzled Root component - adds global components to every page:
  1. ChatbotWidget - RAG-powered chatbot in bottom right
  2. NavbarAuthButton - Auth button in navbar (injected via portal)
*/

interface RootProps {
    children: ReactNode;
}

export default function Root({ children }: RootProps): React.JSX.Element {
    // Inject auth button into navbar on mount
    React.useEffect(() => {
        const injectAuthButton = () => {
            const navbar = document.querySelector('.navbar__items--right');
            if (navbar && !document.getElementById('navbar-auth-container')) {
                const container = document.createElement('div');
                container.id = 'navbar-auth-container';
                container.style.marginLeft = '8px';
                navbar.appendChild(container);

                // Render the auth button
                const root = require('react-dom/client').createRoot(container);
                root.render(<NavbarAuthButton />);
            }
        };

        // Try immediately and with delay for SPA navigation
        injectAuthButton();
        const timer = setTimeout(injectAuthButton, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {children}
            <ChatbotWidget apiUrl="http://localhost:8000" />
        </>
    );
}
