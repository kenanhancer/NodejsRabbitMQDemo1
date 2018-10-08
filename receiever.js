var amqp = require('amqplib/callback_api');
var request = require('request');

request.post('http://localhost:3000/messages', function (error, response, body) {

    console.log(response.body);

    // Connect to the server and wait for the queue
    amqp.connect('amqp://192.168.33.19', (err, conn) => {

        conn.createChannel((err, ch) => {
            
            const q = 'person_queue';

            ch.assertQueue(q, {
                durable: false
            });

            console.log(` [*] Waiting for messages in ${q}. To exit press CTRL+C`);

            ch.consume(q, msg => {
                
                console.log(` [x] Received ${msg.content}`);
                conn.close();
            }, {
                    noAck: true
                });

        });

    });

});