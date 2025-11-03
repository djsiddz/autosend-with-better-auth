/**
 * Better Auth Configuration
 * 
 * This file sets up Better Auth with:
 * - SQLite database (better-sqlite3)
 * - Email & Password authentication
 * - After hook for sending welcome email via AutoSend
 */

import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import Database from "better-sqlite3";
import { sendEmail } from "../services/autosend.js";

export const auth = betterAuth({
    database: new Database("./database.db"),

    emailAndPassword: {
        enabled: true,
    },
    /**
         * Hooks allow us to execute custom logic during the auth lifecycle
         * 
         * After Hook for Signup:
         * - Triggers after a user successfully signs up
         * - Sends a welcome email via AutoSend
         * - Demonstrates AutoSend integration for transactional emails
         */
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            // Check if this is a signup endpoint
            if (ctx.path.startsWith("/sign-up")) {
                const newSession = ctx.context.newSession;

                // If a new session was created, send welcome email
                if (newSession && newSession.user) {
                    const user = newSession.user;

                    console.log(`[Better Auth Hook] New user signed up: ${user.email}`);

                    try {
                        // Send welcome email via AutoSend
                        await sendEmail({
                            to: {
                                email: user.email,
                                name: user.name || user.email,
                            },
                            templateId: 'A-1f984970226a335045f3', // from AutoSend dashboard
                            dynamicData: {
                                firstName: user.name || user.email,
                                dashboardLink: 'http://the-app.localhost:3000/dashboard',
                            },
                        });

                        console.log(`[AutoSend] Welcome email sent to: ${user.email}`);
                    } catch (error) {
                        // Log the error but don't fail the signup process
                        console.error(`[AutoSend] Failed to send welcome email:`, error.message);
                        // In production, you might want to:
                        // 1. Queue the email for retry
                        // 2. Log to error monitoring service
                        // 3. Send to a dead letter queue
                    }
                }
            }
        }),
    },
});
