const express = require('express');
const app = express();
const amqp = require('amqplib/callback_api');

app.route('/messages').post((req, res) => {

    amqp.connect('amqp://192.168.33.19', (err, conn) => {

        conn.createChannel((err, ch) => {

            const q = 'person_queue';

            ch.assertQueue(q, { durable: false });

            setTimeout(() => {

                const person = { personId: 1, FirstName: 'Kenan', LastName: 'Hancer' };

                const msg = JSON.stringify(person);

                ch.sendToQueue(q, Buffer.from(msg));

                console.log(` [X] Send ${msg}`);

            }, 6000);

        });

        // The connection will close in 10 seconds
        setTimeout(() => {
            conn.close();
        }, 10000);

    });

    res.send('The POST request is being processed!');
});

const server = app.listen(3000, function () {

    const address = server.address();
    const host = address.address;
    const port = address.port;

    console.log(`Nodejs with RabbitMQ app listening at http://${host}:${port}`);
});
