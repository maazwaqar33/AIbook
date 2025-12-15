import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// I'm organizing chapters in a logical learning progression
// Starting from foundations and building up to advanced humanoid robotics
const sidebars: SidebarsConfig = {
    tutorialSidebar: [
        'intro',
        {
            type: 'category',
            label: '1. Introduction to Robotics & AI',
            items: [
                'chapter-01-introduction/index',
                'chapter-01-introduction/history-evolution',
                'chapter-01-introduction/ai-types-and-approaches',
                'chapter-01-introduction/robot-classifications',
                'chapter-01-introduction/ethics-and-society',
            ],
        },
        {
            type: 'category',
            label: '2. Foundations: Math & Programming',
            items: [
                'chapter-02-foundations/index',
                'chapter-02-foundations/linear-algebra',
                'chapter-02-foundations/python-for-robotics',
                'chapter-02-foundations/cpp-basics',
                'chapter-02-foundations/ros2-intro',
            ],
        },
        {
            type: 'category',
            label: '3. Robot Hardware Systems',
            items: [
                'chapter-03-hardware/index',
                'chapter-03-hardware/sensors',
                'chapter-03-hardware/actuators-motors',
                'chapter-03-hardware/microcontrollers',
                'chapter-03-hardware/power-systems',
            ],
        },
        {
            type: 'category',
            label: '4. Kinematics & Dynamics',
            items: [
                'chapter-04-kinematics/index',
                'chapter-04-kinematics/forward-kinematics',
                'chapter-04-kinematics/inverse-kinematics',
                'chapter-04-kinematics/dynamics',
                'chapter-04-kinematics/simulation-tools',
            ],
        },
        {
            type: 'category',
            label: '5. AI for Robotics',
            items: [
                'chapter-05-ai/index',
                'chapter-05-ai/machine-learning-basics',
                'chapter-05-ai/deep-learning',
                'chapter-05-ai/reinforcement-learning',
                'chapter-05-ai/llms-for-robots',
            ],
        },
        {
            type: 'category',
            label: '6. Perception & Interaction',
            items: [
                'chapter-06-perception/index',
                'chapter-06-perception/computer-vision',
                'chapter-06-perception/sensor-fusion',
                'chapter-06-perception/slam',
                'chapter-06-perception/human-robot-interaction',
            ],
        },
        {
            type: 'category',
            label: '7. Humanoid Robotics',
            items: [
                'chapter-07-humanoids/index',
                'chapter-07-humanoids/bipedal-locomotion',
                'chapter-07-humanoids/balance-control',
                'chapter-07-humanoids/physical-ai',
                'chapter-07-humanoids/real-world-applications',
            ],
        },
        {
            type: 'category',
            label: '8. Capstone Projects',
            items: [
                'chapter-08-capstone/index',
                'chapter-08-capstone/project-ideas',
                'chapter-08-capstone/implementation-guide',
                'chapter-08-capstone/resources',
            ],
        },
    ],
};

export default sidebars;
