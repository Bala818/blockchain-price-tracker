import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        logger: true, // Enable logging for debugging
        debug: true,  // Enable detailed debug output
    });

    async sendAlertEmail(to: string, subject: string, text: string): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: `"Blockchain Tracker" <${process.env.EMAIL_USER}>`, // Explicit from field
                to,
                subject,
                text,
            });
            console.log(`Email sent to ${to} with subject: ${subject}`);
        } catch (error) {
            console.error(`Failed to send email to ${to}:`, error.stack || error.message);
        }
    }

    async sendTestEmail(): Promise<void> {
        try {
            await this.transporter.sendMail({
                from: `"Blockchain Tracker" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_USER, // Send to self for testing
                subject: 'Test Email from Blockchain Tracker',
                text: 'This is a test email to verify the email configuration.',
            });
            console.log('Test email sent successfully!');
        } catch (error) {
            console.error('Failed to send test email:', error.stack || error.message);
        }
    }
}
