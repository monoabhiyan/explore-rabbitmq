import amqp from "amqplib";

const receiveMessage = async () => {
  const url = "amqp://127.0.0.1";
  const exchangeName = "logs";

  try {
    const connection = await amqp.connect(url);
    const channel = await connection.createChannel();
    await channel.assertExchange(exchangeName, "fanout", { durable: false });
    const Q = await channel.assertQueue("", { exclusive: true }); // exclusive: true will delete the queue once the connection gets lost. 
    console.log(`Waiting for payload in queue: ${Q.queue}`);
    channel.bindQueue(Q.queue, exchangeName, "");
    channel.consume(
      Q.queue,
      (message) => {
        if (message.content) {
          console.log(`The message is: ${message.content.toString()}`);
        }
      },
      { noAck: true }
    );
  } catch (e) {
    console.log(e);
  }
};

receiveMessage();
