/**
 * AutoSend Service
 * 
 * Documentation: https://docs.autosend.com/api-reference
 */

const AUTOSEND_API_URL = 'https://api.autosend.com/v1/mails/send';

/**
 * Send an email using AutoSend API
 * 
 * @param {Object} payloadData - Email configuration
 * @param {Object} payloadData.to - Recipient information
 * @param {string} payloadData.to.email - Recipient email address
 * @param {string} payloadData.to.name - Recipient name
 * @param {string} payloadData.subject - Email subject
 * @param {string} payloadData.html - HTML content of the email
 * @param {string} payloadData.templateId - Template ID for the email template to be used
 * @param {Object} [payloadData.dynamicData] - Dynamic data for template variables
 * @returns {Promise<Object>} AutoSend API response
 */
export async function sendEmail(payloadData) {
    const apiKey = process.env.AUTOSEND_API_KEY;
    const fromEmail = process.env.AUTOSEND_FROM_EMAIL;
    const fromName = process.env.AUTOSEND_FROM_NAME;
    const testEnv = process.env.TEST_ENV; //true for Dev or false for Production

    if (!apiKey) {
        throw new Error('AUTOSEND_API_KEY is not set in environment variables');
    }

    if (!fromEmail) {
        throw new Error('AUTOSEND_FROM_EMAIL is not set in environment variables');
    }

    try {
        const response = await fetch(AUTOSEND_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: {
                    email: payloadData.to.email,
                    name: payloadData.to.name || payloadData.to.email,
                },
                from: {
                    email: fromEmail,
                    name: fromName || 'The App',
                },
                ...(payloadData.subject && { subject: payloadData.subject }),
                ...(payloadData.templateId && { templateId: payloadData.templateId }),
                ...(payloadData.html && { html: payloadData.html }),
                ...(payloadData.dynamicData && { dynamicData: payloadData.dynamicData }),
                test: testEnv === 'true' // You can remove this completely in production, a nice utility given by AutoSend
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('AutoSend API Error:', data);
            throw new Error(
                data.message || `AutoSend API request failed with status ${response.status}`
            );
        }

        console.log('Email sent successfully:', data.data?.emailId);
        return data;
    } catch (error) {
        if (error.response?.status === 429) {
            // Rate limit - retry later
        } else if (error.response?.status === 400) {
            // Validation error - fix the data
        } else {
            // Other error - log and alert
            console.error('Failed to send email via AutoSend:', error.message);
            throw error;
        }
    }
}

/**
 * Send email verification email
 * 
 * @param {Object} user - User object
 * @param {string} user.email - User email
 * @param {string} user.name - User name
 * @param {string} verificationToken - Verification token
 * @param {string} verificationEmailHtml - HTML content for verification email
 */
export async function sendVerificationEmail(user, verificationToken, verificationEmailHtml) {
    const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    const verificationLink = `${appBaseUrl}/api/auth/verify-email?token=${verificationToken}`;

    return sendEmail({
        to: {
            email: user.email,
            name: user.name || user.email,
        },
        subject: 'Verify Your Email Address',
        html: verificationEmailHtml,
        dynamicData: {
            name: user.name || user.email,
            verificationLink,
            token: verificationToken,
        },
    });
}

/**
 * Send password reset email
 * 
 * @param {Object} user - User object
 * @param {string} user.email - User email
 * @param {string} user.name - User name
 * @param {string} resetToken - Password reset token
 * @param {string} resetEmailHtml - HTML content for password reset email
 */
export async function sendPasswordResetEmail(user, resetToken, resetEmailHtml) {
    const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000';
    const resetLink = `${appBaseUrl}/reset-password?token=${resetToken}`;

    return sendEmail({
        to: {
            email: user.email,
            name: user.name || user.email,
        },
        subject: 'Reset Your Password',
        html: resetEmailHtml,
        dynamicData: {
            name: user.name || user.email,
            resetLink,
            token: resetToken,
        },
    });
}
