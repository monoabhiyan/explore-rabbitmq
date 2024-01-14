import amqp from "amqplib";

const sendMessage = async () => {
  const url = "amqp://127.0.0.1";
  const queueName = "task";

  try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });

    channel.prefetch(1);

    console.log(`Waiting for payload in queue: ${queueName}`);

    channel.consume(
      queueName,
      (message) => {
        const secs = message.content.toString().substring(4);

        console.log(`${secs} secs worth of task received...`);

        setTimeout(() => {
          console.log("Done resizing image");
          channel.ack(message);
        }, secs * 1000);
      },
      { noAck: false }
    );
  } catch (e) {
    console.log(e);
  }
};

sendMessage();
// node send.js time5 && node send.js time1 && node send.js time1 && node send.js time1 && node send.js time1 && node send.js time1 && node send.js time3