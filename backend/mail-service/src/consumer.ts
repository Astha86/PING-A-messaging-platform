import amqplib from 'amqplib';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let channel: amqplib.Channel;

export const startSendOTPConsumer = async () => {
    try {
        const connection = await amqplib.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST,
            port: Number(process.env.RABBITMQ_PORT),
            username: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASSWORD,
        });

        channel = await connection.createChannel();
        const queueName = 'send-otp';
        await channel.assertQueue(queueName, { durable: true });
        console.log('Connected to RabbitMQ and waiting for messages in send-otp queue');

        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const { to, subject, body } = JSON.parse(msg.content.toString());

                    // Configure your email transporter (using Gmail as an example)
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
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
    } catch (error) {
        console.error('Failed to start send OTP consumer:', error);
        throw error;
    }
}