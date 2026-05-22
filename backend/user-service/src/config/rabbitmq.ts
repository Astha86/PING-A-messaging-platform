import amqplib from 'amqplib';

let channel: amqplib.Channel;

export const connectRabbitMQ = async () => {
    const maxRetries = 10;
    const retryDelay = 5000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Connecting to RabbitMQ... Attempt ${attempt}`);

            const connection = await amqplib.connect(
                process.env.RABBITMQ_URL as string
            );

            channel = await connection.createChannel();

            console.log('Connected to RabbitMQ successfully');

            connection.on('error', (err) => {
                console.error('RabbitMQ connection error:', err);
            });

            connection.on('close', () => {
                console.error('RabbitMQ connection closed');
            });

            return;
        } 
        catch (error) {
            console.error(
                `Failed to connect to RabbitMQ (Attempt ${attempt})`,
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
};

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