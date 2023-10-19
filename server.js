const express = require('express');
const morgan = require('morgan');
const { sendSMS } = require('./utils/sendSms');
const bodyParser = require('body-parser');
const controllers = require('./controllers')

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
});

app.use(controllers);

port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
