const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('combined'));
app.use(bodyParser.json());

app.post('/sms-replies', (req, res) => {
  const textId = req.body.textId;
  const fromNumber = req.body.fromNumber;
  const text = req.body.text;

  // Process the SMS reply here
  console.log(`Received SMS reply from ${fromNumber}: ${text}`);

  // You can send a response depending on the received reply
  // ...

  res.sendStatus(200); // Respond with a 200 OK status
});

// Add the route for handling SMS replies
app.post('/api/handleSmsReply', (req, res) => {
  // Process incoming SMS replies from TextBelt
  // ...

  res.sendStatus(200); // Respond with a 200 OK status
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
