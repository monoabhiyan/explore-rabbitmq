import amqp from "amqplib";

const sendMessage = async () => {
  const url = "amqp://127.0.0.1";
  const exchangeName = "direct_logs";
  const args = process.argv.slice(2);
  const logType = args[0];
  const message = args[1] || "Hello World";

  try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, "direct", { durable: false });

    channel.publish(exchangeName, logType, Buffer.from(message));

    console.log(`Sent payload: ${message} `);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (e) {
    console.log(e);
  }
};

sendMessage();
