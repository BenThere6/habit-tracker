require('dotenv').config();

function sendSMS(message) {
    const recipient = process.env.PHONE_NUMBER;
    const apiKey = process.env.API_KEY;

    fetch('https://textbelt.com/text', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            phone: recipient,
            message: message,
            key: apiKey,
        }),
    }).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
    });
}

module.exports = { sendSMS }