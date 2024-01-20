import amqp from "amqplib";

const sendMessage = async () => {
  const url = "amqp://127.0.0.1";
  const exchangeName = "logs";
  const payload = process.argv.slice(2).join(" ") || "Hello World";
  try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, "fanout", { durable: false  });

    channel.publish(exchangeName, '', Buffer.from(payload));

    console.log(`Sent payload: ${payload} `);
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (e) {
    console.log(e);
  }
};

sendMessage();
