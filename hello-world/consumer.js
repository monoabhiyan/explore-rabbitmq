import amqp from "amqplib";

const sendMessage = async () => {
  const url = "amqp://127.0.0.1";
  const queueName = "hello";

  try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: false });
    console.log(`Waiting for payload in queue: ${queueName}`);
    channel.consume(
      queueName,
      (message) => {
        console.log(`Received payload ${message.content.toString()}`);
      },
      { noAck: true }
    );
  } catch (e) {
    console.log(e);
  }
};

sendMessage();
