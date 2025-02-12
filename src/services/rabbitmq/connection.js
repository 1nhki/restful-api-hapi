const amqp = require('amqplib')

let connection;

async function getconnection() {
    if (!connection){
        connection = await amqp.connect(process.env.RABBITMQ_SERVER)
    }
    
    return connection
}

module.exports = {getconnection}