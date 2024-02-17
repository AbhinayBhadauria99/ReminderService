const express = require('express');
const bodyParser = require('body-parser');

const { PORT } = require('./config/serverConfig');
const { createChannel, subscribeMessage } = require('./utils/messageQueue');

const { REMINDER_BINDING_KEY } = require('./config/serverConfig');

//const { sendBasicEmail } = require('./services/email-service');
const TicketController = require('./controllers/ticket-controller');
const EmailService = require('./services/email-service');

const jobs = require('./utils/job');


const setupAndStartServer = async () => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));


    app.post('/api/v1/tickets', TicketController.create);

    const channel = await createChannel();
    subscribeMessage(channel, EmailService.subscribeEvents, REMINDER_BINDING_KEY);

    app.listen(PORT, () => {
        console.log(`Server started at port ${PORT}`);
        //  jobs();

        /*     sendBasicEmail(
                 'mroverledge@gmail.com',
                 'abhinaybhadauria99@gmail.com',
                 'This is a testing email',
                 'Hey, how are you, I hope you like the support'
             );            */
    });
}

setupAndStartServer();

