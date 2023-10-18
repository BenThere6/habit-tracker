const express = require('express');
const bodyParser = require('body-parser');
const app = express();

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

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
