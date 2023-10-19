const express = require('express');
const morgan = require('morgan');
const { sendSMS } = require('./smsUtility');
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

app.post('/api/handleSmsReply', (req, res) => {
    const textId = req.body.textId;
    const fromNumber = req.body.fromNumber;
    const text = req.body.text;

    console.log(`Received SMS reply from ${fromNumber}: ${text}`);

    res.sendStatus(200);
});

port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
