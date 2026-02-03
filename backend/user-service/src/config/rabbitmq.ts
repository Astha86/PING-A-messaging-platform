import amqplib from 'amqplib';

let channel: amqplib.Channel;

export const connectRabbitMQ = async () => {
    try{
        const connection = await amqplib.connect({
            protocol: 'amqp',
            hostname: process.env.RABBITMQ_HOST,
            port: Number(process.env.RABBITMQ_PORT),
            username: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASSWORD,
        });

        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ successfully');
    }
    catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
        throw error;
    }
}

export const publishToQueue = async (queueName: string, message: string) => {
    if (!channel) {
        throw new Error('RabbitMQ channel is not established');
    }

    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(
        queueName, 
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
    );
};