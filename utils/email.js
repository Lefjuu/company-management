const nodemailer = require('nodemailer');
const {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USERNAME,
    EMAIL_PASSWORD,
    EMAIL_FROM,
    PROJECT_MODE,
} = require('../config');

module.exports = class Email {
    constructor(user, url) {
        // this.to = user.email;
        this.to = 'karol.legut121@gmail.com';
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Lefju <${EMAIL_FROM}>`;
    }

    newTransport() {
        // if (PROJECT_MODE === 'production') {
        //     // Sendgrid
        //     return nodemailer.createTransport({
        //         service: 'SendGrid',
        //         auth: {
        //             user: process.env.SENDGRID_USERNAME,
        //             pass: process.env.SENDGRID_PASSWORD,
        //         },
        //     });
        // }

        return nodemailer.createTransport({
            host: EMAIL_HOST,
            port: EMAIL_PORT,
            auth: {
                user: EMAIL_USERNAME,
                pass: EMAIL_PASSWORD,
            },
        });
    }

    async send(template, subject, html) {
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html: html,
        };

        await this.newTransport()
            .sendMail(mailOptions)
            .then(() => console.log('email sent'));
    }

    async sendVerificationToken() {
        await this.send(
            'welcome',
            'Welcome to the Company App!',
            `<!DOCTYPE html>
                <html>
                <head>
                    <title>Account Verification - Action Required</title>
                </head>
                <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">

                <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);">
                    <h2 style="color: #333;">Account Verification - Action Required</h2>
                    <p>Dear ${this.firstName},</p>
                    <p>We hope this message finds you well. In order to ensure the security of your account, we kindly ask you to complete a quick verification process by clicking on the link below:</p>
                    
                    <a href=${this.url} style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Verify My Account</a>
                
                    <p> ${this.url}</p>
                    <p>Your prompt attention to this matter is greatly appreciated. If you have any questions or concerns, please do not hesitate to contact our support team.</p>
                    <p>Thank you for choosing [Company Name].</p>
                    <p>Best regards,<br>The [Company Name] Team</p>
                </div>

                </body>
                </html>
                `,
        );
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)',
            `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ccc;
                            border-radius: 5px;
                        }
                        .header {
                            text-align: center;
                        }
                        .message {
                            margin-bottom: 20px;
                        }
                        .link {
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #007bff;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset</h1>
                        </div>
                        <div class="message">
                            <p>Hello ${this.firstName}, </p>
                            <p>We received a request to reset your password. Click the link below to reset your password:</p>
                            <a class="link" href=${this.url}>Reset Password</a>
                            ${this.url}
                        </div>
                        <p>If you didn't request a password reset, you can safely ignore this email.</p>
                        <p>Best regards,</p>
                        <p>Management App</p>
                    </div>
                </body>
                </html>
                `,
        );
    }
};
