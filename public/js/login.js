document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailEl= document.getElementById('email');
    const passwordEl = document.getElementById('password');
    const email = emailEl.value;
    const password = passwordEl.value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const response = await fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, rememberMe }),
        headers: { 'Content-Type': 'application/json' },
    });
    const errorMessageElement = document.getElementById('login-error-message');
    if (response.status === 400) {
        return response.json().then(data => {
            const errorMessage = data.error;
            errorMessageElement.textContent = errorMessage;
            errorMessageElement.style.display = 'block';
            passwordEl.value = '';
        });
    } else if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        errorMessageElement.textContent = 'An error occurred. Please try again.';
        errorMessageElement.style.display = 'block';
    }
    });