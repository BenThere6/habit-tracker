document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailEl= document.getElementById('email');
    const passwordEl = document.getElementById('password');
    const email = emailEl.value;
    const password = passwordEl.value;

    const response = await fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 400) {
        return response.json().then(data => {
            const errorMessage = data.error;
            const errorMessageElement = document.getElementById('message');
            errorMessageElement.textContent = errorMessage;
            errorMessageElement.style.display = 'block';
            passwordEl.value = '';
        });
    } else if (response.ok) {
        document.location.replace('/dashboard');

        // this.reset();
    }});