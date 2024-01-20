import amqp from "amqplib";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log("Usage: should receive error, info, warning");
  process.exit(1);
}
const receiveMessage = async () => {
  const url = "amqp://127.0.0.1";
  const exchangeName = "direct_logs";

  try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, "direct", { durable: false });
    const Q = await channel.assertQueue("", { exclusive: true }); // exclusive: true will delete the queue once the connection gets lost.
    console.log(`Waiting for payload in queue: ${Q.queue}`);

    args.forEach((severity) => {
      channel.bindQueue(Q.queue, exchangeName, severity);
    });

    channel.consume(
      Q.queue,
      (message) => {
        if (message.content) {
          console.log(
            `Routing key: ${
              message.fields.routingKey
            }, ${message.content.toString()}`
          );
        }
      },
      { noAck: true }
    );
  } catch (e) {
    console.log(e);
  }
};

receiveMessage();
