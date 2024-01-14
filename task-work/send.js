import amqp from "amqplib";

const sendMessage = async () => {
  const url = "amqp://127.0.0.1";
  const queueName = "task";
  const payload = process.argv.slice(2).join(" ") || "Hello World";
  try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    channel.sendToQueue(queueName, Buffer.from(payload), { persistent: true });

    console.log(`Sent payload: ${payload} worth of task...`);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (e) {
    console.log(e);
  }
};

sendMessage();
