/*
  Better-Auth configuration for the Physical AI Textbook.
  I'm setting up email/password auth with custom user fields
  for storing their software/hardware background.
*/

import { betterAuth } from 'better-auth';

// Auth configuration - will connect to backend
export const auth = betterAuth({
    // Using backend API for auth
    baseURL: process.env.NODE_ENV === 'production'
        ? 'https://your-backend.vercel.app'
        : 'http://localhost:8000',

    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
    },

    // Custom user fields for personalization
    user: {
        additionalFields: {
            experienceLevel: {
                type: 'string',
                defaultValue: 'beginner',
            },
            softwareBackground: {
                type: 'string',
                defaultValue: '',
            },
            hardwareBackground: {
                type: 'string',
                defaultValue: '',
            },
            programmingLanguages: {
                type: 'string',
                defaultValue: '',
            },
            interests: {
                type: 'string',
                defaultValue: 'robotics,ai',
            },
        },
    },
});

export type Session = typeof auth.$Infer.Session;
