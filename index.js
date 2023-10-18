function sendSMS(recipient, message, key) {
    fetch('https://textbelt.com/text', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            phone: '3855663025',
            message: 'Hello world',
            key: 'f0954f45e6a298c2d03611413734123ab0fc917erxqqZQaXJttCc3PzJsdeuLoWI',
        }),
    }).then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
    });
}
