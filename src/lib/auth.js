/**
 * Better Auth Configuration
 * 
 * This file sets up Better Auth with:
 * - SQLite database (better-sqlite3)
 * - Email & Password authentication
 * - After hook for sending welcome email via AutoSend
 */

import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
    database: new Database("./database.db"),

    emailAndPassword: {
        enabled: true,
    }
});
