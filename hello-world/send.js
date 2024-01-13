import amqp from "amqplib";

const sendMessage = async () => {
  const url = "amqp://127.0.0.1";
  const queueName = "hello";
  const payload = "hello world";
  try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false });
    channel.sendToQueue(queueName, Buffer.from(payload));
    console.log(`Sent payload: ${payload}`);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (e) {
    console.log(e);
  }
};

sendMessage();
