document.getElementById('contact-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('contact-message').value;

    try {
        const response = await fetch('/submit-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message);

            const successMessage = document.getElementById('success-message');
            successMessage.textContent = data.message;

            successMessage.classList.add('show');

            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 6000);
        } else {
            console.error('Error submitting form:', response.statusText);
        }
        document.getElementById('contact-form').reset()
    } catch (error) {
        console.error('Error:', error);
    }
});