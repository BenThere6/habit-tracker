const express = require('express');
const morgan = require('morgan');
const smsUtility = require('./smsUtility');
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
});

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.post('/handleSmsReply', (req, res) => {
    const textId = req.body.textId;
    const fromNumber = req.body.fromNumber;
    const text = req.body.text;

    // Process the SMS reply here
    smsUtility.sendSMS(`Received SMS reply from ${fromNumber}: ${text}`);

    // You can send a response depending on the received reply
    // ...

    res.sendStatus(200); // Respond with a 200 OK status
});

// Start the server
port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
