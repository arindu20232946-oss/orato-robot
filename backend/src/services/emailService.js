import nodemailer from "nodemailer";

/**
 * Email Service for Orato Platform
 * Handles sending emails via Gmail SMTP
 */

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "orato.platform@gmail.com",
    pass: "gomd rpol ckua zcrk",  // Gmail App Password
  },
});

/**
 * Send OTP email to user
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit OTP code
 */
export const sendOtpEmail = async (email, otp) => {
  try {
    // Email options
    const mailOptions = {
      from: "orato.platform@gmail.com",
      to: email,
      subject: "Password Reset OTP - Orato Platform",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 10px;
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .otp-box {
              background: #f0f0f0;
              border: 2px dashed #10b981;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #10b981;
              letter-spacing: 8px;
              font-family: 'Courier New', monospace;
            }
            .warning {
              color: #e74c3c;
              font-size: 14px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Orato</h1>
              <p>Language Learning Platform</p>
            </div>
            <div class="content">
              <h2>Hello!</h2>
              <p>You requested to reset your password for Orato Platform. Use the OTP code below to proceed:</p>
              
              <div class="otp-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Valid for 10 minutes</p>
              </div>
              
              <p>Enter this code on the password reset page to create a new password.</p>
              
              <p class="warning">
                ⚠️ If you didn't request this, please ignore this email. Your password will remain unchanged.
              </p>
              
              <p>For security reasons, do not share this code with anyone.</p>
              
              <p>Best regards,<br>The Orato Team</p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; 2026 Orato Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hello!

You requested to reset your password for Orato Platform.

Your OTP Code: ${otp}

This code is valid for 10 minutes.

Enter this code on the password reset page to create a new password.

If you didn't request this, please ignore this email.

Best regards,
The Orato Team
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ OTP email sent successfully to ${email}`);
    console.log(`   Message ID: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error("❌ OTP email sending failed:", error);
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
};

/**
 * Send Password Reset Link to user
 * @param {string} email - Recipient email address
 * @param {string} resetUrl - Password reset URL with token
 * @param {string} userName - User's full name
 */
export const sendPasswordResetEmail = async (email, resetUrl, userName) => {
  try {
    // Email options
    const mailOptions = {
      from: "orato.platform@gmail.com",
      to: email,
      subject: "Reset Your Password - Orato Platform",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 10px;
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white !important;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
            }
            .button:hover {
              opacity: 0.9;
            }
            .link-box {
              background: #f0f0f0;
              border: 2px dashed #10b981;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              word-break: break-all;
              font-size: 12px;
              color: #666;
            }
            .warning {
              color: #e74c3c;
              font-size: 14px;
              margin-top: 20px;
              padding: 15px;
              background: #fee;
              border-left: 4px solid #e74c3c;
              border-radius: 4px;
            }
            .info-box {
              background: #e8f5e9;
              border-left: 4px solid #10b981;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Orato</h1>
              <p>Language Learning Platform</p>
            </div>
            <div class="content">
              <h2>Hi ${userName || "there"}!</h2>
              <p>We received a request to reset your password for your Orato account.</p>
              
              <p>Click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <div class="link-box">${resetUrl}</div>
              
              <div class="info-box">
                <strong>⏰ Important:</strong> This link will expire in <strong>1 hour</strong> for security reasons.
              </div>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong><br>
                If you didn't request a password reset, please ignore this email. Your password will remain unchanged and your account is safe.
              </div>
              
              <p><strong>Security Tips:</strong></p>
              <ul>
                <li>Never share this link with anyone</li>
                <li>Orato staff will never ask for your password</li>
                <li>Always verify the URL before entering your password</li>
              </ul>
              
              <p>Best regards,<br><strong>The Orato Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; 2026 Orato Platform. All rights reserved.</p>
              <p style="margin-top: 10px;">
                <a href="mailto:orato.platform@gmail.com" style="color: #10b981; text-decoration: none;">Contact Support</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hi ${userName || "there"}!

We received a request to reset your password for your Orato account.

Click this link to reset your password:
${resetUrl}

⏰ IMPORTANT: This link will expire in 1 hour for security reasons.

⚠️ SECURITY NOTICE:
If you didn't request a password reset, please ignore this email. Your password will remain unchanged and your account is safe.

SECURITY TIPS:
- Never share this link with anyone
- Orato staff will never ask for your password
- Always verify the URL before entering your password

Best regards,
The Orato Team

---
This is an automated message, please do not reply to this email.
© 2026 Orato Platform. All rights reserved.
Contact Support: orato.platform@gmail.com
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Password reset email sent successfully to ${email}`);
    console.log(`   Message ID: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error("❌ Password reset email failed:", error);
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};

/**
 * Send Welcome Email to new user
 * @param {string} email - Recipient email address
 * @param {string} userName - User's full name
 */
export const sendWelcomeEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: "orato.platform@gmail.com",
      to: email,
      subject: "Welcome to Orato - Start Your Language Learning Journey! 🎉",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
              border-radius: 10px;
            }
            .header {
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: white;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #10b981 0%, #059669 100%);
              color: white !important;
              padding: 15px 40px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              margin: 20px 0;
            }
            .feature-box {
              background: #f0f9ff;
              border-left: 4px solid #10b981;
              padding: 15px;
              margin: 15px 0;
              border-radius: 4px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
              padding-top: 20px;
              border-top: 1px solid #ddd;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Welcome to Orato!</h1>
              <p>Your Language Learning Journey Starts Here</p>
            </div>
            <div class="content">
              <h2>Hi ${userName}! 👋</h2>
              <p>Thank you for joining Orato! We're excited to have you as part of our learning community.</p>
              
              <h3>🚀 Get Started:</h3>
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
              </div>
              
              <h3>✨ What You Can Do:</h3>
              <div class="feature-box">
                <strong>📚 Interactive Lessons</strong><br>
                Learn through engaging, bite-sized lessons designed for all skill levels
              </div>
              <div class="feature-box">
                <strong>📊 Track Your Progress</strong><br>
                Monitor your learning journey with detailed analytics and achievements
              </div>
              <div class="feature-box">
                <strong>🎯 Personalized Learning</strong><br>
                Customize your learning path based on your goals and skill level
              </div>
              
              <p>If you have any questions or need help, feel free to reach out to our support team.</p>
              
              <p>Happy Learning!<br><strong>The Orato Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; 2026 Orato Platform. All rights reserved.</p>
              <p style="margin-top: 10px;">
                <a href="mailto:orato.platform@gmail.com" style="color: #10b981; text-decoration: none;">Contact Support</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hi ${userName}! 👋

Thank you for joining Orato! We're excited to have you as part of our learning community.

Get Started:
Visit your dashboard: ${process.env.FRONTEND_URL}/dashboard

What You Can Do:
📚 Interactive Lessons - Learn through engaging, bite-sized lessons
📊 Track Your Progress - Monitor your journey with detailed analytics
🎯 Personalized Learning - Customize your path based on your goals

If you have any questions, reach out to our support team.

Happy Learning!
The Orato Team

---
© 2026 Orato Platform. All rights reserved.
Contact Support: orato.platform@gmail.com
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    console.log(`✅ Welcome email sent successfully to ${email}`);
    console.log(`   Message ID: ${info.messageId}`);
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error("❌ Welcome email failed:", error);
    // Don't throw error for welcome email - it's not critical
    return { success: false, error: error.message };
  }
};

/**
 * Send English Proficiency Level Upgrade Notification
 * @param {string} email - Recipient email address
 * @param {string} userName - User's full name
 * @param {string} newLevel - The new skill level
 */
export const sendLevelUpEmail = async (email, userName, newLevel) => {
  try {
    const mailOptions = {
      from: "orato.platform@gmail.com",
      to: email,
      subject: "Level Up! Congratulations 🏆",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; text-align: center; }
            .level-box { font-size: 24px; font-weight: bold; color: #10b981; padding: 15px; border: 2px dashed #10b981; border-radius: 10px; margin: 20px 0; display: inline-block;}
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Orato</h1>
              <p>English Proficiency Level Upgrade Notification</p>
            </div>
            <div class="content">
              <h2>Hi ${userName}! 👋</h2>
              <h3>Congratulations! You are now on the next level.</h3>
              <p>Your dedication is paying off. Keep up the great work!</p>
              
              <div class="level-box">
                Level: ${newLevel ? newLevel.charAt(0).toUpperCase() + newLevel.slice(1) : 'Advanced'}
              </div>
              
              <p>Ready for more complex challenges? Log in to discover new exercises tailored for your level.</p>
              <br/>
              <p><strong>The Orato Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; 2026 Orato Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hi ${userName}! 👋

Congratulations! You are now on the next level. 
Level: ${newLevel ? newLevel.charAt(0).toUpperCase() + newLevel.slice(1) : 'Advanced'}

Your dedication is paying off. Keep up the great work!

The Orato Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Level up email sent to ${email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Level up email failed:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send Daily Reminder Email
 * @param {string} email - Recipient email address
 * @param {string} userName - User's full name
 */
export const sendDailyReminderEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: "orato.platform@gmail.com",
      to: email,
      subject: "Orato Daily Reminder ⏰",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; text-align: center; }
            .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white !important; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Orato</h1>
              <p>Daily Learning Reminder</p>
            </div>
            <div class="content">
              <h2>Hi ${userName || 'Learner'},</h2>
              <h3>Get ready to English training.</h3>
              <p>It's time for your daily practice. Just a few minutes a day helps build lasting fluency.</p>
              
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Start Learning</a>
              
              <p>We are waiting for you!</p>
              <br/>
              <p><strong>The Orato Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; 2026 Orato Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hi ${userName || 'Learner'},

Get ready to English training.
It's time for your daily practice! Just a few minutes a day helps build lasting fluency.

Start learning now: ${process.env.FRONTEND_URL}/dashboard

The Orato Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Daily reminder email sent to ${email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Daily reminder email failed:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send Weekly Progress Update Email
 * @param {string} email - Recipient email address
 * @param {string} userName - User's full name
 */
export const sendWeeklyProgressEmail = async (email, userName) => {
  try {
    const mailOptions = {
      from: "orato.platform@gmail.com",
      to: email,
      subject: "Your Weekly Progress Report 📊",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; text-align: center; }
            .button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white !important; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Orato</h1>
              <p>Weekly Progress Updates</p>
            </div>
            <div class="content">
              <h2>Hi ${userName || 'Learner'},</h2>
              <h3>The weekly summary report is ready.</h3>
              <p>Check out your stats and progress from the past 7 days. Consistency is key to mastery!</p>
              
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">View My Report</a>
              
              <br/>
              <p><strong>The Orato Team</strong></p>
            </div>
            <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; 2026 Orato Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Hi ${userName || 'Learner'},

The weekly summary report is ready. 
Check out your stats and progress from the past 7 days to see how far you've come!

View your report on the dashboard: ${process.env.FRONTEND_URL}/dashboard

The Orato Team
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Weekly progress email sent to ${email}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Weekly progress email failed:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Verify email configuration on server startup
 */
export const verifyEmailConfig = async () => {
  try {
    await transporter.verify();
    console.log("✅ Email service is ready to send emails");
    return true;
  } catch (error) {
    console.error("❌ Email service configuration error:", error);
    return false;
  }
};