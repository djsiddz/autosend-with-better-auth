/**
 * Email Templates
 * 
 * Simple HTML email templates for Better Auth + AutoSend integration
 */

/**
 * Email Verification Template
 * Sent when user needs to verify their email address
 */
export function getVerificationEmailTemplate() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
        <h1 style="color: #2196F3;">Verify Your Email Address 📧</h1>
        <p>Hi <strong>{{name}}</strong>,</p>
        <p>Please verify your email address to complete your registration and access all features.</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="{{verificationUrl}}" 
             style="background-color: #2196F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Verify Email Address
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="background-color: #fff; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 14px;">
          {{verificationUrl}}
        </p>
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>The Team</strong>
        </p>
      </div>
      <p style="font-size: 12px; color: #666; margin-top: 20px; text-align: center;">
        This email was sent using AutoSend integration with Better Auth
      </p>
    </body>
    </html>
  `;
}

/**
 * Password Reset Email Template
 * Sent when user requests to reset their password
 */
export function getPasswordResetEmailTemplate() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Password</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 10px;">
        <h1 style="color: #FF9800;">Reset Your Password 🔐</h1>
        <p>Hi <strong>{{name}}</strong>,</p>
        <p>We received a request to reset your password. Click the button below to setup a new password:</p>
        <div style="margin: 30px 0; text-align: center;">
          <a href="{{resetUrl}}" 
             style="background-color: #FF9800; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="background-color: #fff; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 14px;">
          {{resetUrl}}
        </p>
        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 20px 0;">
          <p style="margin: 0; color: #856404;">
            <strong>Security Notice:</strong> This link will expire in 1 hour for security reasons.
          </p>
        </div>
        <p style="font-size: 14px; margin-top: 30px;">
          If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>
        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>The Team</strong>
        </p>
      </div>
      <p style="font-size: 12px; color: #666; margin-top: 20px; text-align: center;">
        This email was sent using AutoSend integration with Better Auth
      </p>
    </body>
    </html>
  `;
}
