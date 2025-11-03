import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import {
    sendVerificationEmail,
    sendPasswordResetEmail
} from "./services/autosend.js";
import {
    getVerificationEmailTemplate,
    getPasswordResetEmailTemplate
} from "./utils/email-templates.js";


// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

/**
 * CORS Configuration
 * As per Better Auth documentation for Express integration
 */
app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

/**
 * Mount Better Auth Handler
 * 
 * IMPORTANT: For Express v5, use "/api/auth/*splat" route pattern
 * Do NOT use express.json() middleware before this route
 * 
 * This handles all Better Auth endpoints including:
 * - POST /api/auth/sign-up/email (triggers welcome email via after hook)
 * - POST /api/auth/sign-in/email
 * - POST /api/auth/sign-out
 * - GET /api/auth/session
 * - GET /api/auth/ok (health check)
 */
app.all("/api/auth/*splat", toNodeHandler(auth));

/**
 * Now we can use express.json() for our custom routes
 * (Better Auth handler is already mounted above)
 */
app.use(express.json());

/**
 * Health Check Endpoint
 */
app.get("/", (req, res) => {
    res.json({
        message: "Better Auth + AutoSend Integration Server",
        status: "running",
        endpoints: {
            auth: "/api/auth/*",
            verifyEmail: "/api/auth/verify-email",
            resetPassword: "/api/auth/reset-password",
        },
    });
});

/**
 * Email Verification Endpoint
 * 
 * Demonstrates AutoSend integration for email verification
 * 
 * @route POST /api/auth/verify-email
 * @body {string} email - User email to send verification to
 */
app.post("/api/auth/verify-email", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // In a real application, you would:
        // 1. Check if user exists in database
        // 2. Generate a secure verification token
        // 3. Store token with expiry in database
        // For this demo, we'll generate a simple token

        const verificationToken = Buffer.from(
            `${email}-${Date.now()}-${Math.random()}`
        ).toString("base64url");

        // Get verification email template
        const verificationEmailHtml = getVerificationEmailTemplate();

        // Send verification email via AutoSend
        await sendVerificationEmail(
            { email, name: email }, // User object
            verificationToken,
            verificationEmailHtml
        );

        console.log(`[AutoSend] Verification email sent to: ${email}`);

        res.json({
            success: true,
            message: "Verification email sent successfully",
            data: {
                email,
                // In production, don't return the token
                // This is just for demo purposes
                token: verificationToken,
            },
        });
    } catch (error) {
        console.error("[AutoSend] Error sending verification email:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send verification email",
            error: error.message,
        });
    }
});

/**
 * Password Reset Request Endpoint
 * 
 * Demonstrates AutoSend integration for password reset emails
 * 
 * @route POST /api/auth/reset-password
 * @body {string} email - User email to send password reset to
 */
app.post("/api/auth/reset-password", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        // In a real application, you would:
        // 1. Verify user exists in database
        // 2. Generate a secure reset token
        // 3. Store token with expiry (typically 1 hour) in database
        // 4. For security, always return success even if user doesn't exist
        // For this demo, we'll generate a simple token

        const resetToken = Buffer.from(
            `${email}-${Date.now()}-${Math.random()}`
        ).toString("base64url");

        // Get password reset email template
        const resetEmailHtml = getPasswordResetEmailTemplate();

        // Send password reset email via AutoSend
        await sendPasswordResetEmail(
            { email, name: email }, // User object
            resetToken,
            resetEmailHtml
        );

        console.log(`[AutoSend] Password reset email sent to: ${email}`);

        res.json({
            success: true,
            message: "Password reset email sent successfully",
            data: {
                email,
                // In production, NEVER return the reset token
                // This is just for demo purposes
                token: resetToken,
            },
        });
    } catch (error) {
        console.error("[AutoSend] Error sending password reset email:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send password reset email",
            error: error.message,
        });
    }
});

/**
 * Example route to demonstrate how to get current user session
 * using Better Auth's getSession method
 */
app.get("/api/me", async (req, res) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }

        res.json({
            success: true,
            session,
        });
    } catch (error) {
        console.error("Error getting session:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get session",
        });
    }
});

/**
 * Start the server
 */
app.listen(port, () => {
    console.log(`\n🚀 Server is running on http://localhost:${port}`);
    console.log(`📧 AutoSend integration is active`);
    console.log(`\nAvailable endpoints:`);
    console.log(`  - POST http://localhost:${port}/api/auth/sign-up/email`);
    console.log(`  - POST http://localhost:${port}/api/auth/sign-in/email`);
    console.log(`  - POST http://localhost:${port}/api/auth/verify-email`);
    console.log(`  - POST http://localhost:${port}/api/auth/reset-password`);
    console.log(`  - GET  http://localhost:${port}/api/auth/ok`);
    console.log(`  - GET  http://localhost:${port}/api/me\n`);
});
