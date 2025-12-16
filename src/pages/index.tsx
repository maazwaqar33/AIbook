import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

// Key Capabilities - What makes this textbook different
const Capabilities = [
    {
        icon: '📖',
        title: 'Structured Textbook',
        description: 'Canonical content written for Physical AI and Humanoid Robotics.',
    },
    {
        icon: '🧠',
        title: 'AI Assistant',
        description: 'Answers questions strictly from the book content.',
    },
    {
        icon: '✨',
        title: 'Personalized Learning',
        description: 'Adapts explanations based on your background.',
    },
    {
        icon: '🌐',
        title: 'Urdu Translation',
        description: 'AI-generated Urdu with proper RTL layout.',
    },
];

// Learning Steps
const Steps = [
    { number: '1', title: 'Read the Chapter', description: 'Study the structured content' },
    { number: '2', title: 'Ask the Assistant', description: 'Get answers from the book' },
    { number: '3', title: 'Personalize or Translate', description: 'Adapt to your needs' },
];

function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                    Physical AI & Humanoid Robotics
                </h1>
                <p className={styles.heroSubtitle}>
                    An AI-Native Textbook
                </p>
                <p className={styles.heroDescription}>
                    Learn how intelligent agents, robotics, and human-AI collaboration
                    shape the future of technology.
                </p>
                <div className={styles.heroButtons}>
                    <Link className={styles.primaryButton} to="/docs/intro">
                        Start Learning
                    </Link>
                    <Link className={styles.secondaryButton} to="/docs/intro">
                        Open Assistant
                    </Link>
                </div>
            </div>
        </section>
    );
}

function CapabilitiesSection() {
    return (
        <section className={styles.capabilities}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>Key Capabilities</h2>
                <div className={styles.capabilityGrid}>
                    {Capabilities.map((cap, idx) => (
                        <div key={idx} className={styles.capabilityCard}>
                            <span className={styles.capabilityIcon}>{cap.icon}</span>
                            <h3 className={styles.capabilityTitle}>{cap.title}</h3>
                            <p className={styles.capabilityDescription}>{cap.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function LearningSteps() {
    return (
        <section className={styles.learningSteps}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>How Learning Works</h2>
                <div className={styles.stepsGrid}>
                    {Steps.map((step, idx) => (
                        <div key={idx} className={styles.stepCard}>
                            <span className={styles.stepNumber}>{step.number}</span>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDescription}>{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function TechStack() {
    return (
        <section className={styles.techStack}>
            <div className={styles.container}>
                <p className={styles.techText}>
                    Built with Docusaurus, FastAPI, Gemini API, and Retrieval-Augmented Generation.
                </p>
            </div>
        </section>
    );
}

function CallToAction() {
    return (
        <section className={styles.cta}>
            <div className={styles.container}>
                <Link className={styles.ctaButton} to="/docs/intro">
                    Start the Textbook
                </Link>
            </div>
        </section>
    );
}

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title="Physical AI Textbook"
            description="An AI-native textbook for Physical AI and Humanoid Robotics">
            <main>
                <Hero />
                <CapabilitiesSection />
                <LearningSteps />
                <TechStack />
                <CallToAction />
            </main>
        </Layout>
    );
}
