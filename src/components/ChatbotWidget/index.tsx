import React, { useState, useRef, useEffect, JSX } from 'react';
import styles from './ChatbotWidget.module.css';

/*
  This is my RAG chatbot widget that floats in the bottom right corner.
  It connects to my FastAPI backend to answer questions about the textbook.
  Users can also select text and ask questions about it!
*/

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: { text: string; source: string }[];
}

interface ChatbotWidgetProps {
    apiUrl?: string;
}

export default function ChatbotWidget({
    apiUrl = 'http://localhost:8000'
}: ChatbotWidgetProps): JSX.Element {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '0',
            role: 'assistant',
            content: 'Hi! I\'m your AI tutor for this Physical AI textbook. Ask me anything about robotics, AI, or the content in this book. You can also select text on the page and ask me about it!'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedText, setSelectedText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Listen for text selection
    useEffect(() => {
        const handleSelection = () => {
            const selection = window.getSelection();
            if (selection && selection.toString().trim().length > 10) {
                setSelectedText(selection.toString().trim());
            }
        };

        document.addEventListener('mouseup', handleSelection);
        return () => document.removeEventListener('mouseup', handleSelection);
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: selectedText
                ? `[About selected text: "${selectedText.slice(0, 100)}..."]\n\n${input}`
                : input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const endpoint = selectedText ? '/api/chat/selected' : '/api/chat';
            const response = await fetch(`${apiUrl}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    selected_text: selectedText || undefined
                })
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response,
                sources: data.sources
            };

            setMessages(prev => [...prev, assistantMessage]);
            setSelectedText(''); // Clear selection after use
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: 'Sorry, I encountered an error. Make sure the backend is running at ' + apiUrl
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className={styles.container}>
            {/* Toggle button */}
            <button
                className={styles.toggleButton}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? '✕' : '💬'}
            </button>

            {/* Chat panel */}
            {isOpen && (
                <div className={styles.panel}>
                    <div className={styles.header}>
                        <span className={styles.headerIcon}>🤖</span>
                        <span className={styles.headerTitle}>AI Tutor</span>
                    </div>

                    {/* Selected text indicator */}
                    {selectedText && (
                        <div className={styles.selectedText}>
                            <span>📝 Selected: "{selectedText.slice(0, 50)}..."</span>
                            <button onClick={() => setSelectedText('')}>✕</button>
                        </div>
                    )}

                    {/* Messages */}
                    <div className={styles.messages}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`${styles.message} ${styles[msg.role]}`}
                            >
                                <div className={styles.messageContent}>
                                    {msg.content}
                                </div>
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className={styles.sources}>
                                        <small>Sources: {msg.sources.map(s => s.source).join(', ')}</small>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className={`${styles.message} ${styles.assistant}`}>
                                <div className={styles.loading}>Thinking...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className={styles.inputContainer}>
                        <textarea
                            className={styles.input}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={selectedText ? 'Ask about the selected text...' : 'Ask me anything...'}
                            rows={1}
                        />
                        <button
                            className={styles.sendButton}
                            onClick={sendMessage}
                            disabled={isLoading || !input.trim()}
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
