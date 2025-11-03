import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

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
        },
    });
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
    console.log(`  - GET  http://localhost:${port}/api/auth/ok`);
    console.log(`  - GET  http://localhost:${port}/api/me\n`);
});
