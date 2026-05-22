import amqplib from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

let channel: amqplib.Channel;

export const startSendOTPConsumer = async () => {
    const maxRetries = 10;
    const retryDelay = 5000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Connecting to RabbitMQ for Send OTP Consumer... Attempt ${attempt}`);
            const connection = await amqplib.connect(process.env.RABBITMQ_URL as string);

            channel = await connection.createChannel();
            const queueName = 'send-otp';
            await channel.assertQueue(queueName, { durable: true });
            console.log('Connected to RabbitMQ and waiting for messages in send-otp queue');

            connection.on('error', (err) => {
                console.error('RabbitMQ connection error in Mail Service:', err);
            });

            connection.on('close', () => {
                console.error('RabbitMQ connection closed in Mail Service');
            });

            channel.consume(queueName, async (msg) => {
                if (msg) {
                    try {
                        const { to, subject, body } = JSON.parse(msg.content.toString());

                        if (!process.env.SENDGRID_API_KEY) {
                            throw new Error('SENDGRID_API_KEY environment variable is not configured');
                        }

                        // HTML email
                        const otpCode = body.match(/\d{4,6}/)?.[0] || body;
                        const htmlBody = `
                            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff;">
                                <div style="text-align: center; margin-bottom: 24px;">
                                    <h1 style="color: #6C63FF; font-size: 28px; margin: 0;">PING</h1>
                                    <p style="color: #666; font-size: 14px; margin-top: 4px;">Secure Messaging Platform</p>
                                </div>
                                <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; text-align: center;">
                                    <p style="color: #333; font-size: 16px; margin: 0 0 16px 0;">Your verification code is:</p>
                                    <div style="background: #6C63FF; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px 24px; border-radius: 8px; display: inline-block;">
                                        ${otpCode}
                                    </div>
                                    <p style="color: #999; font-size: 13px; margin: 16px 0 0 0;">This code expires in 5 minutes. Do not share it with anyone.</p>
                                </div>
                                <p style="color: #aaa; font-size: 12px; text-align: center; margin-top: 24px;">
                                    If you didn't request this code, you can safely ignore this email.
                                </p>
                            </div>
                        `;

                        // Send email via SendGrid HTTP API
                        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                personalizations: [
                                    {
                                        to: [{ email: to }]
                                    }
                                ],
                                from: {
                                    email: process.env.EMAIL_USER || 'asthasahani08@gmail.com',
                                    name: 'PING'
                                },
                                reply_to: {
                                    email: process.env.EMAIL_USER || 'asthasahani08@gmail.com',
                                    name: 'PING Support'
                                },
                                subject: subject,
                                content: [
                                    {
                                        type: 'text/plain',
                                        value: body
                                    },
                                    {
                                        type: 'text/html',
                                        value: htmlBody
                                    }
                                ]
                            })
                        });

                        if (!response.ok) {
                            const errorText = await response.text();
                            throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
                        }

                        console.log(`OTP email sent successfully to ${to} via SendGrid HTTP API`);

                        // Acknowledge the message
                        channel.ack(msg);
                    } catch (error) {
                        console.error('Failed to send email:', error);
                    }
                }
            });

            return; // Successfully connected and started consumer, exit the retry loop
        } catch (error) {
            console.error(
                `Failed to start send OTP consumer (Attempt ${attempt}):`,
                error
            );

            if (attempt === maxRetries) {
                throw error;
            }

            console.log(`Retrying in ${retryDelay / 1000} seconds...`);

            await new Promise((resolve) =>
                setTimeout(resolve, retryDelay)
            );
        }
    }
}