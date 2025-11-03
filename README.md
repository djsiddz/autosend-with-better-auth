# Better Auth + AutoSend Integration

A sample backend app to demo integrating [AutoSend](https://autosend.com) for sending transactional emails using [Better Auth](https://better-auth.com) authentication framework.

## 📋 Overview

This project showcases three key email triggers using AutoSend:

1. **Welcome Email** - Automatically sent after user signup using Better Auth's after hook
2. **Email Verification** - Manual endpoint to send email verification links
3. **Password Reset** - Manual endpoint to send password reset links

---

## READ THE ARTICLE (COMING SOON)

---

## 🛠️ Tech Stack

- **Runtime**: Node.js v22.16.0
- **Package Manager**: pnpm v10.20.0
- **Framework**: Express.js v5.1.0
- **Authentication**: Better Auth v1.3.34
- **Database**: better-sqlite3 v12.4.1
- **Email Service**: AutoSend (API integration)

## 📁 Project Structure

```text
asend-with-better-auth/
├── src/
│   ├── index.js                 # Express server with routes
│   ├── lib/
│   │   └── auth.js              # Better Auth configuration with hooks
│   ├── services/
│   │   └── autosend.js          # AutoSend email service
│   └── utils/
│       └── email-templates.js   # HTML email templates
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── database.db                  # SQLite database (auto-generated)
```

## 🚀 Getting Started

### Prerequisites

- Node.js v22 or higher
- AutoSend API key ([Sign-up & Get one here](https://autosend.com/))

### Use this as a starting template

1. **Use `git clone` or the "Use Template" button on GitHub**

2. **Navigate to the project directory**

    ```bash
    cd asend-with-better-auth
    ```

3. **Install dependencies**

    ```bash
    pnpm install
    ```

4. **Set up environment variables**

    Copy `.env.example` to `.env`:

    ```bash
    cp .env.example .env
    ```

    Then edit `.env` with your configuration:

    ```env
    # Environment Identifier
    TEST_ENV=true

    # Better Auth Configuration
    BETTER_AUTH_SECRET=add-your-secret-key-here
    BETTER_AUTH_URL=http://localhost:3000

    # AutoSend Configuration
    AUTOSEND_API_KEY=add-your-autosend-api-key-here
    AUTOSEND_FROM_EMAIL=hello@mail.yourdomain.com
    AUTOSEND_FROM_NAME=Your App Name

    # Optional: Base URL for email links
    APP_BASE_URL=http://localhost:3000
    ```

5. **Set up the database**

    Better Auth will automatically create the database tables on first run, but you can also use the CLI:

    ```bash
    pnpm run db:migrate
    ```

6. **Start the server**

    Development mode (with auto-reload):

    ```bash
    pnpm run dev
    ```

    Production mode:

    ```bash
    pnpm start
    ```

    The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Better Auth Endpoints

These are automatically provided by Better Auth:

#### Sign Up (Triggers Welcome Email)

```bash
POST /api/auth/sign-up/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-secure-password",
  "name": "John Doe"
}
```

**Email Trigger**: ✅ Welcome email sent automatically via After Hook

#### Sign In

```bash
POST /api/auth/sign-in/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "your-secure-password"
}
```

#### Get Current Session

```bash
GET /api/me
```

#### Sign Out

```bash
POST /api/auth/sign-out
```

#### Health Check

```bash
GET /api/auth/ok
```

### 📝 Testing AutoSend Integration with cURL

#### 1. Sign Up (Triggers Welcome Email)

```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "name": "Test User"
  }'
```

#### 2. Send Verification Email [DEMO ONLY]

```bash
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Email Trigger**: ✅ Verification email sent via AutoSend

**Response**:

```json
{
  "success": true,
  "message": "Verification email sent successfully",
  "data": {
    "email": "user@example.com",
    "token": "base64-encoded-token"
  }
}
```

#### 3. Send Password Reset Email [DEMO ONLY]

```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

**Email Trigger**: ✅ Password reset email sent via AutoSend

**Response**:

```json
{
  "success": true,
  "message": "Password reset email sent successfully",
  "data": {
    "email": "user@example.com",
    "token": "base64-encoded-token"
  }
}
```

## 🔐 Security Notes

**For Production:**

1. **Never expose tokens in responses** - The demo returns tokens for testing purposes only
2. **Implement token expiry** - Store tokens in database with expiration timestamps
3. **Use secure token generation** - Use cryptographically secure random generators
4. **Rate limiting** - Add rate limiting to prevent abuse
5. **Email validation** - Validate email addresses before sending
6. **HTTPS only** - Always use HTTPS in production
7. **Environment variables** - Never commit `.env` file to version control

## 🐛 Troubleshooting

### Database Issues

```bash
# Delete and recreate database
rm database.db
pnpm run db:migrate
```

### AutoSend Email Not Sending

1. **Check API key**: Verify `AUTOSEND_API_KEY` in `.env`
2. **Check from email**: Ensure `AUTOSEND_FROM_EMAIL` is from a verified domain
3. **Check logs**: Server logs show AutoSend API responses
4. **Test endpoint**: Try `GET http://localhost:3000/api/auth/ok`

### Express v5 Route Issues

Make sure to use the correct route pattern for Express v5:

- ✅ `/api/auth/*splat` (Express v5)
- ❌ `/api/auth/*` (Express v4)

## 📚 Documentation References

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Better Auth Hooks](https://www.better-auth.com/docs/concepts/hooks)
- [Better Auth Express Integration](https://www.better-auth.com/docs/integrations/express)
- [AutoSend API Reference](https://docs.autosend.com/api-reference)

## 📄 License

MIT

## 🤝 Contributing

This is a sample project for demonstration purposes. Feel free to fork and modify for your needs, or use it as a starting point to something big!

---

Built with ❤️ to showcase using AutoSend + Better Auth integration
