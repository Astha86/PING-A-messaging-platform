import amqplib from 'amqplib';
import nodemailer from 'nodemailer';
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

                        // Configure your email transporter (using Gmail as an example)
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL_USER,
                                pass: process.env.EMAIL_PASSWORD,
                            },
                        });

                        // Email options
                        const mailOptions = {
                            from: "PING",
                            to: to,
                            subject: subject,
                            text: body,
                        };

                        // Send the email
                        await transporter.sendMail(mailOptions);
                        console.log(`OTP email sent to ${to}`);

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