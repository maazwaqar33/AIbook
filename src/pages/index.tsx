import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

// I'm creating a feature list to showcase the main sections of my book
const FeatureList = [
    {
        title: 'Foundations First',
        emoji: '🧮',
        description: 'Master the math, programming, and ROS2 skills that power modern robotics.',
    },
    {
        title: 'Hardware Deep Dive',
        emoji: '🔧',
        description: 'Understand sensors, actuators, and microcontrollers from the ground up.',
    },
    {
        title: 'AI-Powered Robots',
        emoji: '🤖',
        description: 'Learn ML, deep learning, and how LLMs are revolutionizing robotics.',
    },
    {
        title: 'Humanoid Mastery',
        emoji: '🦿',
        description: 'Build bipedal robots that walk, balance, and interact with humans.',
    },
];

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <header className={clsx('hero hero--primary', styles.heroBanner)}>
            <div className="container">
                <Heading as="h1" className="hero__title">
                    {siteConfig.title}
                </Heading>
                <p className="hero__subtitle">
                    The complete guide to building intelligent machines that move, think, and interact.
                </p>
                <div className={styles.buttons}>
                    <Link
                        className="button button--primary button--lg"
                        to="/docs/intro">
                        Start Learning 🚀
                    </Link>
                </div>
            </div>
        </header>
    );
}

function Feature({ title, emoji, description }) {
    return (
        <div className={clsx('col col--3')}>
            <div className="card padding--lg margin--sm">
                <div className="text--center" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {emoji}
                </div>
                <Heading as="h3" className="text--center">{title}</Heading>
                <p className="text--center">{description}</p>
            </div>
        </div>
    );
}

function HomepageFeatures() {
    return (
        <section className={styles.features}>
            <div className="container">
                <div className="row">
                    {FeatureList.map((props, idx) => (
                        <Feature key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function Home() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout
            title={`Welcome`}
            description="A comprehensive textbook for Physical AI and Humanoid Robotics">
            <HomepageHeader />
            <main>
                <HomepageFeatures />
                <section className={styles.ctaSection}>
                    <div className="container">
                        <div className="text--center padding-vert--xl">
                            <Heading as="h2">Ready to Build the Future?</Heading>
                            <p className="hero__subtitle">
                                This book takes you from zero to building your own humanoid robot.
                            </p>
                            <Link
                                className="button button--primary button--lg"
                                to="/docs/intro">
                                Begin Chapter 1 →
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </Layout>
    );
}
