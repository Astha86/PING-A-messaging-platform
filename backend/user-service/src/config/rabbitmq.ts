import amqplib from 'amqplib';

let channel: amqplib.Channel;

export const connectRabbitMQ = async () => {
    try{
        const connection = await amqplib.connect(process.env.RABBITMQ_URL as string);

        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ successfully');
    }
    catch (error) {
        console.error('Failed to connect to RabbitMQ', error);
        throw error;
    }
}

export const publishToQueue = async (queueName: string, message: any) => {
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